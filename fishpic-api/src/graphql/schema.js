const GraphQL = require('graphql');
const {
  GraphQLObjectType,
  GraphQLSchema,
} = GraphQL;
const ImageQuery = require('./queries/Image');
const SpeciesQuery = require('./queries/Species');
const ImageMutation = require('./mutations/Image');
const FeedbackMutation = require('./mutations/Feedback');
const SpeciesMutation = require('./mutations/Species');


const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  description: 'This is the default root query provided by our application',
  fields: {
    images: ImageQuery.index(),
    image: ImageQuery.image(),
    species: SpeciesQuery.index(),
  }
});

const RootMutation = new GraphQLObjectType({
  name: 'RootMutationType',
  description: 'This is the default root mutation provided by our application',
  fields: {
    createImage: ImageMutation.createImage(),
    updateImage: ImageMutation.updateImage(),
    upsertAnnotation: ImageMutation.upsertAnnotation(),
    deleteImages: ImageMutation.deleteImages(),
    createFeedback: FeedbackMutation.createFeedback(),
    createSpecies: SpeciesMutation.createSpecies(),
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation
});
