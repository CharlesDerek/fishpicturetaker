const GraphQL = require('graphql');
const {
	GraphQLString,
  GraphQLInputObjectType,
} = GraphQL;

import { fields } from '../types/Species';
import SpeciesResolver from '../resolvers/Species';

const speciesInputType = new GraphQLInputObjectType({
  name: "species",
  fields: fields
});

module.exports = {

	createSpecies() {
		return {
			type: GraphQLString,
			description: 'Create a species.',
			args: {
        species: { type: speciesInputType }
      },
      fields: {
        id: { type: GraphQLString }
      },
			resolve(parent, args, context, info) {
				return SpeciesResolver.mutationIndex(args, context);
			}
		}
	},

	getAllSpecies() {
		return {
			type: GraphQLString,
			description: 'Get all species.',
			args: {},
      fields: speciesInputType,
			resolve(parent, args, context, info) {
				return SpeciesResolver.getAllSpecies(args, context);
			}
		}
	}
};
