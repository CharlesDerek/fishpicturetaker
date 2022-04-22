import { API, Storage } from 'aws-amplify';
import { getUserId } from './auth';
import config from '../config';

export const getImages = async () => {
    const query = "{images{id, uploadedDate, arn, classificationResults{class, confidence}, appVersion, identityId, createdInApp, deviceModel, imageModel, modelsAreEqual, isTestData, userIdsToAnnotations }}";
    const { images } = await sendGraphQlQuery(query);
    const userId = await getUserId();
    return (await Promise.all(images.map(hydrateImage(userId))))
        .sort((a, b) => new Date(b.uploadedDate) - new Date(a.uploadedDate));
}

// TODO: add a caching layer using Redux to speed up the app.
export const getImage = async id => {
    //const query = "{image(Id: \"5fe61330-4dd4-11e9-864b-9fa90c9fdba0\"){Id, uploadedDate, Arn, ClassificationResults{Class, Confidence}, AppVersion, IdentityId, CreatedInApp, DeviceModel, ImageModel, ModelsAreEqual, IsTestData } }";
    const query = "query($id: String!) {image(id: $id){id, uploadedDate, arn, classificationResults{class, confidence}, appVersion, identityId, createdInApp, deviceModel, imageModel, modelsAreEqual, isTestData} }";
    const { image } = await sendGraphQlQuery(query, { id });
    const userId = await getUserId();
    return await hydrateImage(userId)(image);
}

export const deleteTestImages = async () => {
    const query = "mutation deleteImages($isTestData: Boolean) { deleteImages(isTestData: $isTestData)}";
    const variables = { isTestData: true };
    const { images } = await sendGraphQlQuery(query, variables);
    return images;
}

export const getImageUrl = async (arn) => {
    const parts = arn.split(":::");
    const fullPath = parts[parts.length - 1];
    const bucketName = config.s3.BUCKET;
    if (fullPath.startsWith(bucketName)) {
        const path = fullPath.substring(bucketName.length);
        const pathParts = path.split("/");
        const nPathParts = 4;
        if (pathParts.length !== nPathParts) {
            throw new Error("Unexpected number of parts in path.");
        }
        const [ , level, identityId, fileName ] = pathParts;
        return await Storage.get(
            fileName,
            { level: level, identityId: identityId}
        );
    } else {
        throw new Error("Unexpected bucket name");
    }
}

export const getAllSpecies = async () => {
    const query = "{species{id,commonName,scientificName,className,otherNames,family,supportedInAppVersion,excludeNoisyWebImages,edibilityRating,eatingNotes,idNotes,isNoTakeSpecies,minimumSizeInCentimetres,maximumSizeInCentimetres,possessionLimit,possessionNotes}}";
    const { species } = await sendGraphQlQuery(query);
    return species;
}

export const upsertAnnotation = async (imageId, annotation) => {
    const query = "mutation upsertAnnotation($imageId: String!, $annotation: Annotation!) { upsertAnnotation(imageId: $imageId, annotation: $annotation) }";
    const variables = { imageId, annotation: replaceEmptyStringsWithNulls(annotation) };
    const { image } = await sendGraphQlQuery(query, variables);
    return image;
}

const sendGraphQlQuery = async (query, variables) => {
    let init = null;
    let fn = null;
    if (query.startsWith("query") || query.startsWith("{")) {
        init = {
            queryStringParameters: { query, variables: JSON.stringify(variables || {}) },
        };
        fn = API.get.bind(API);
    } else if (query.startsWith("mutation")) {
        init = {
            body: { query, variables: variables || {} },
        };
        fn = API.post.bind(API);
    } else {
        throw new Error(`Unexpected query: ${query}.`);
    }
    const { data, errors } = await fn("fishpic", "/graphql", init);
    if (errors !== undefined) {
        throw new Error("API error: " + JSON.stringify(errors));
    }
    return data;
}

const hydrateImage = appUserId => async image => {
    const annotatable = image.createdInApp || image.modelsAreEqual;
    return {
        isTestData: false,
        userId: getUserIdFromIdentityId(image.identityId),
        ...image,
        url: await getImageUrl(image.arn),
        annotatable,
        userShouldAnnotate: annotatable && image.userIdsToAnnotations[appUserId] === undefined
    };
};

const getUserIdFromIdentityId = identityId => {
    const userIdIndex = 1;
    return identityId.split(":")[userIdIndex];
};

const replaceEmptyStringsWithNulls = value => {
    if (typeof(value) === 'object') {
        for (var key in value) {
           const propertyValue = value[key];
            if (propertyValue === "") {
                value[key] = null;
            }
        }
    }
    return value;
}