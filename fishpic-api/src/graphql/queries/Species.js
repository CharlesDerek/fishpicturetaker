const GraphQL = require('graphql');
const {
	GraphQLList,
} = GraphQL;
import SpeciesType from '../types/Species';
import SpeciesResolver from '../resolvers/Species';

module.exports = {
	index() {
		return {
			type: new GraphQLList(SpeciesType),
			description: 'This will return all species.',
			args: {},
			resolve(parent, args, context, info) {
				return SpeciesResolver.index(args, context);
			}
		}
	},
};
