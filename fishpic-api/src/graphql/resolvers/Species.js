import * as dynamoDbLib from "../../libs/dynamodb-lib";
import { validateAuthorizationHeader } from '../../libs/Aws';
import { validateKey } from '../../libs/Auth';

const SpeciesController = {
	index: async (args, context) => {
		console.log(context);
		await validateAuthorizationHeader(context.headers.Authorization, "Annotators");
		return await getAllSpecies();
	},
	
	mutationIndex: async (args, context) => {
		validateKey(context.key);
		const item = Object.assign(args.species, {
			modifiedDate: new Date().toISOString(),
		});
		return await createSpecies(item); 
	},
}

const createSpecies = async species => {
  const params = {
    TableName: "Species",
    Item: species
  };

  try {
    await dynamoDbLib.call("put", params);
  } catch (e) {
    console.error("createImage: " + e);
  }
}

export const getAllSpecies = async () => {
	const params = {
		TableName: "Species",
	};
	try {
		const { Items } = await dynamoDbLib.call("scan", params);
		return Items;
	} catch (e) {
		console.error("index: " + e);
	}

}

export const updateSpecies = async species => {
  const params = {
    TableName: "Species",
		Item: species,
	/*
	Key: {
		Id: image.Id
	},
	ExpressionAttributeValues: image,
	ReturnValues:"UPDATED_NEW"
	*/
  };

  try {
    await dynamoDbLib.call("put", params);
  } catch (e) {
    console.error("updateSpecies: " + e);
  }
}

export default SpeciesController;