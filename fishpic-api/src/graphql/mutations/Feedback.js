const GraphQL = require('graphql');
const {
	GraphQLString,
	GraphQLNonNull,
  GraphQLInputObjectType,
  GraphQLBoolean,
} = GraphQL;
import GraphQLJSON from 'graphql-type-json';

const FeedbackResolver = require('../resolvers/Feedback');

const feedbackInputType = new GraphQLInputObjectType({
  name: "feedback",
  fields: {
    identityId: { type: new GraphQLNonNull(GraphQLString) }, 
    appVersion: { type: new GraphQLNonNull(GraphQLString) }, 
    usageStatistics: { type: new GraphQLNonNull(GraphQLJSON) },
    isTestData: { type: GraphQLBoolean },
    fields: { type: new GraphQLNonNull(GraphQLJSON) },
  }
});

module.exports = {

	createFeedback() {
		return {
			type: GraphQLString,
			description: 'Create a feedback.',
			args: {
        feedback: { type: feedbackInputType }
      },
      fields: {
        id: { type: GraphQLString }
      },
			resolve(parent, args, context, info) {
				return FeedbackResolver.mutationIndex(args, context);
			}
		}
	},

};
