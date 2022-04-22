const GraphQL = require('graphql');
const {
	GraphQLList,
	GraphQLString,
	GraphQLNonNull,
  GraphQLInputObjectType,
  GraphQLFloat,
  GraphQLBoolean,
} = GraphQL;

import {
  GraphQLDateTime
} from  "graphql-iso-date";

const ImageResolver = require('../resolvers/Image');
import { AnnotationInputType } from '../types/Image';

const resultType = new GraphQLInputObjectType({
  name: "result",
  fields: {
    Class: { type: new GraphQLNonNull(GraphQLString) }, 
    Confidence: { type: new GraphQLNonNull(GraphQLFloat) }, 
  }
});

const resultTypeCamelCase = new GraphQLInputObjectType({
  name: "resultV2",
  fields: {
    class: { type: new GraphQLNonNull(GraphQLString) }, 
    confidence: { type: new GraphQLNonNull(GraphQLFloat) }, 
  }
});

const imageV2Fields = {
  key: { type: GraphQLString }, 
  identityId: { type: GraphQLString }, 
  uploadedDate: { type: GraphQLDateTime }, 
  classificationResults: { type: new GraphQLList(new GraphQLNonNull(resultTypeCamelCase)) },
  createdInApp: { type: GraphQLBoolean },
  appVersion: { type: GraphQLString },
  isTestData: { type: GraphQLBoolean },
  imageModel: { type: GraphQLString },
  deviceModel: { type: GraphQLString },
  eulaVersion: { type: GraphQLString }
};

const imageInputType = new GraphQLInputObjectType({
  name: "image",
  fields: {
    // TODO: Once you remove backwards compatibility with the old App Versions, add NonNull types again.
    Key: { type: GraphQLString }, 
    IdentityId: { type: GraphQLString }, 
    CreatedDate: { type: GraphQLDateTime }, 
    ClassificationResults: { type: new GraphQLList(new GraphQLNonNull(resultType)) },
    CreatedInApp: { type: GraphQLBoolean },
    AppVersion: { type: GraphQLString },
    IsTestData: { type: GraphQLBoolean },
    ImageModel: { type: GraphQLString },
    DeviceModel: { type: GraphQLString },
    EulaVersion: { type: GraphQLString },
    ...imageV2Fields,
  }
});

const imageV2InputType = new GraphQLInputObjectType({
  name: "imagev2",
  fields: {
    ...imageV2Fields,
    Id: { type: GraphQLString }, 
    id: { type: GraphQLString }, 
  }
});

module.exports = {

	createImage() {
		return {
			type: GraphQLString,
			description: 'Create an image.',
			args: {
        image: { type: imageInputType }
      },
      fields: {
        id: { type: GraphQLString }
      },
			resolve(parent, args, context, info) {
				return ImageResolver.mutationIndex(args, context);
			}
		}
	},

	updateImage() {
		return {
			type: GraphQLString,
			description: 'Update an image.',
			args: {
        image: { type: imageV2InputType }
      },
      fields: {
        id: { type: GraphQLString }
      },
			resolve(parent, args, context, info) {
				return ImageResolver.updateImage(args, context);
			}
		}
	},

	upsertAnnotation() {
		return {
			type: GraphQLString,
			description: 'Upsert user\'s annotation for an image.',
			args: {
        imageId: { type: new GraphQLNonNull(GraphQLString) },
        annotation: { type: AnnotationInputType }
      },
      fields: {},
			resolve(parent, args, context, info) {
				return ImageResolver.upsertAnnotation(args, context);
			}
		}
  },
  
	deleteImages() {
		return {
			type: GraphQLString,
			description: 'Delete a set of images.',
			args: {
        isTestData: { type: GraphQLBoolean }
      },
      fields: {
        id: { type: GraphQLString }
      },
			resolve(parent, args, context, info) {
				return ImageResolver.deleteImages(args, context);
			}
		}
	},

};
