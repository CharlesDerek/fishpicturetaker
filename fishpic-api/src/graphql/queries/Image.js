const GraphQL = require('graphql');
const {
	GraphQLList,
	GraphQLString,
	GraphQLNonNull,
} = GraphQL;
import ImageType from '../types/Image';
const ImageResolver = require('../resolvers/Image');

module.exports = {
	index() {
		return {
			type: new GraphQLList(ImageType),
			description: 'This will return all the images.',
			args: {},
			resolve(parent, args, context, info) {
				return ImageResolver.index(args, context);
			}
		}
	},
	image() {
		return {
			type: ImageType,
			description: 'Retrieve an image matching the given id.',
			args: {
				id: { type: new GraphQLNonNull(GraphQLString) }
			},
			resolve(parent, args, context, info) {
				return ImageResolver.image(args, context);
			}
		}
	},
};
