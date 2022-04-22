const GraphQL = require("graphql");

const {
  GraphQLString,
  GraphQLID,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLList,
  GraphQLInputObjectType
} = GraphQL;

import {
  GraphQLDateTime
} from  "graphql-iso-date";
import GraphQLJSON from 'graphql-type-json';

const ResultType = new GraphQL.GraphQLObjectType({
  name: "Result",
  fields: {
    class: { type: new GraphQLNonNull(GraphQLString) }, 
    confidence: { type: new GraphQLNonNull(GraphQLFloat) }, 
  }
});

const annotationFields = {
  category: { type: new GraphQLNonNull(GraphQLString) },
  speciesName: { type: GraphQLString },
  speciesId: { type: GraphQLString },
  confidence: { type: GraphQLString },
  isCopyrightMaterial: { type: GraphQLBoolean },
  isProfileImageCandidate: { type: GraphQLBoolean },
  notes: { type: GraphQLString },
};

export const AnnotationInputType = new GraphQLInputObjectType({
  name: 'Annotation',
  fields: annotationFields
});

const ImageType = new GraphQL.GraphQLObjectType({
  name: "Image",
  description: "Image Type for all images uploaded via API.",

  fields: () => ({
    id: {
      type: GraphQLID,
      description: "ID of the Image"
    },
    uploadedDate: {
      type: new GraphQLNonNull(GraphQLDateTime),
      description: "The date the image was uploaded."
    },
    arn: {
      type: new GraphQLNonNull(GraphQLString),
      description: "The ARN of the Image."
    },
    identityId: {
      type: new GraphQLNonNull(GraphQLString),
      description: "The IdentityId of the user."
    },
    createdInApp: {
      type: GraphQLBoolean,
      description: "A bool representing whether the image was created in the app."
    },
    classificationResults: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ResultType))) ,
      description: "The classification results for the image."
    },
    appVersion: {
      type: GraphQLString,
      description: "The version of the App that was used."
    },
    deviceModel: {
      type: GraphQLString,
      description: "The model of the user's device."
    },
    imageModel: {
      type: GraphQLString,
      description: "The model in the Image's EXIF metadata."
    },
    modelsAreEqual: {
      type: GraphQLBoolean,
      description: "A bool representing whether the DeviceModel and ImageModel match."
    },
    isTestData: {
      type: GraphQLBoolean,
      description: "A bool representing whether the image was created as a test."
    },
    userIdsToAnnotations: {
      type: GraphQLJSON,
      description: "A dictionary of user ids to Annotations.",
    }
  })
});

export default ImageType;