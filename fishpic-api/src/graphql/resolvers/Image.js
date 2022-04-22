const uuid = require("uuid");
import * as dynamoDbLib from "../../libs/dynamodb-lib";
import { validateAuthorizationHeader } from '../../libs/Aws';
import { validateKey } from '../../libs/Auth';
import { deleteImage as deleteImageFromStorage } from '../../libs/storage';
import { toCamel } from '../../libs/utils';

const ImageController = {
	index: async (args, context) => {
		//console.log(context);
		await validateAuthorizationHeader(context.headers.Authorization, "Annotators");
		const params = {
			TableName: "Images",
		};
		try {
			const { Items } = await dynamoDbLib.call("scan", params);
			return Items;
		} catch (e) {
			console.error("index: " + e);
		}
	},

	image: async (args, context) => {
		await validateAuthorizationHeader(context.headers.Authorization, "Annotators");
		const params = {
			TableName: "Images",
			Key: { Id: args.id }
		};
		try {
			const { Item } = await dynamoDbLib.call("get", params);
			return Item;
		} catch (e) {
			console.error("index: " + e);
		}
	},
	
	mutationIndex: async (args, context) => {
		validateKey(context.key);
		const image = updateImageSchema(args.image);
		const s3BucketArn = "arn:aws:s3:::fishpic-images";
		const imageArn = `${s3BucketArn}/private/${image.identityId}/${image.key}`;
		delete image["fileName"];
		delete image["key"];
		const { imageModel, deviceModel } = image;
		const id = uuid.v1();
		const item = Object.assign(image, {
			Id: id,
			id,
			arn: imageArn,
			uploadedDate: image.uploadedDate.toISOString(),
			imageModel,
			deviceModel,
			modelsAreEqual: modelsAreEqual(imageModel, deviceModel),
			userIdsToAnnotations: {}
		});
		return await createImage(item); 
	},

	updateImage: async (args, context) => {
		await validateAuthorizationHeader(context.headers.Authorization, "Annotators");
		const { image } = args;
		const { imageModel, deviceModel } = image;
		const item = Object.assign(image, {
			modelsAreEqual: modelsAreEqual(imageModel, deviceModel)
		});
		return await updateImage(item); 
	},

	upsertAnnotation: async (args, context) => {
		const userId = await validateAuthorizationHeader(context.headers.Authorization, "Annotators");
		const { imageId, annotation } = args;
		console.log(`|upsertAnnotation| imageId: ${imageId} userId: ${userId}.`)
		return await upsertAnnotation(imageId, userId, annotation); 
	},
	
	deleteImages: async (args, context) => {
		if (args.isTestData !== undefined) {
			if (args.isTestData !== true) {
				throw new Error("Can only bulk delete test images.");
			}
			await validateAuthorizationHeader(context.headers.Authorization, "Annotators");
			const images = await getImages(args.isTestData);
			console.log(`About to delete ${images.length} images.`);
			for (var i = 0; i < images.length; i++) {
				await deleteImage(images[i]);
			}
		} else {
			throw new Error("Not implemented.");
		}
	}
}

const updateImageSchema = image => {
	if (image.Key !== undefined) {
		const { createdDate, ...rest } = toCamel(image);
		return { uploadedDate: createdDate, ...rest };
	} else if (image.key !== undefined) {
		return image;
	} else {
		throw new Error("key and Key are missing from image.");
	}
}

const modelsAreEqual = (imageModel, deviceModel) => 
	imageModel !== undefined && imageModel !== null && imageModel !== "" && imageModel === deviceModel;

const createImage = async image => {
  const params = {
    TableName: "Images",
    Item: image
  };

  try {
    await dynamoDbLib.call("put", params);
  } catch (e) {
    console.error("createImage: " + e);
  }
}

const updateImage = async image => {
  const params = {
    TableName: "Images",
	Item: image,
	/*
	Key: {
		Id: image.Id
	},
	ExpressionAttributeValues: image,
	ReturnValues:"UPDATED_NEW"
	*/
  };

  try {
    await dynamoDbLib.call("update", params);
  } catch (e) {
    console.error("updateImage: " + e);
  }
}

const upsertAnnotation = async (imageId, userId, annotation) => {
	if (userId === undefined) {
		throw new Error('userId is required.');
	}
  const createMapParams = {
    TableName: "Images",
		Key: {
			Id: imageId
		},
		UpdateExpression: 'SET #u = :emptyMap',
    ConditionExpression: 'attribute_not_exists(#u)',
    ExpressionAttributeNames: {
        '#u': 'userIdsToAnnotations'
    },
		ExpressionAttributeValues: {
			':emptyMap': {}
		},
  };
  const params = {
    TableName: "Images",
		Key: {
			Id: imageId
		},
		UpdateExpression: 'SET userIdsToAnnotations.#userId = :annotation',
		ExpressionAttributeNames: {
			'#userId': userId,
		},
		ExpressionAttributeValues: {
			':annotation': { ...annotation, modifiedDate: new Date().toISOString() }
		},
		ReturnValues:"UPDATED_NEW"
	};
	try {
    await dynamoDbLib.call("update", createMapParams);
	} catch (e) {
		// Do nothing if the first request fails if the condition fails.
	}

  try {
		const { Attributes } = await dynamoDbLib.call("update", params);
		return Attributes.userIdsToAnnotations;
  } catch (e) {
    console.error("upsertAnnotation: " + e);
  }
}

async function getImages(isTestData = false) {
	try {
		const params = {
			TableName: "Images",
			FilterExpression: "isTestData = :isTestData",
			ExpressionAttributeValues: {
				":isTestData": isTestData
			}
		};
		const { Items } = await dynamoDbLib.call("scan", params);
		return Items;
	} catch (e) {
		console.error(e);
	}
}

async function deleteImage({ arn, Arn, Id, id }) {
	// TODO: delete this backwards compatibility code.
	arn = arn || Arn;
	id = id || Id;
	const key = arn.substring(arn.indexOf("/") + 1)
	try {
		await deleteImageFromStorage(key);
	} catch (e) {
		console.error("Error deleting image from S3 bucket: " + e)
	}
	await deleteImageFromDatabase(id);
}

const deleteImageFromDatabase = async (id) => {
  const params = {
    TableName: "Images",
    Key: { Id: id }
  };
	console.log(`Deleting Image Item: ${id}.`);
	await dynamoDbLib.call("delete", params);
}

module.exports = ImageController;

/*
const migrateImageItems = async () => {
	console.log("Migration Images");
	const images = await getImages();
	const updatedImages = images.map(x => {
		if (x.Arn !== undefined) {
			const { createdDate, ...rest } = toCamel(x);
			x = { uploadedDate: createdDate, ...rest };
		} else if (x.arn !== undefined) {
		} else {
			throw new Error("arn and Arn are missing from image.");
		}
		const { id, ...rest2 } = x;
		return { id, Id: id, ...rest2 };
	});
	updatedImages.forEach(async x => {
		console.log(x);
		await updateImage(x);
	});
}

(async () => { await migrateImageItems() })();
*/