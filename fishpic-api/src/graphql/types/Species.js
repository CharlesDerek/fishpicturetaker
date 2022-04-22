const GraphQL = require("graphql");

const {
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLList
} = GraphQL;

export const fields = {
  id: { type: GraphQLString },
  commonName: { type: GraphQLString },
  authorityCommonName: { type: GraphQLString },
  scientificName: { type: GraphQLString },
  className: { type: GraphQLString },
  otherNames: { type: new GraphQLList(new GraphQLNonNull(GraphQLString)) },
  family:  { type: GraphQLString },
  supportedInAppVersion:  { type: GraphQLString },
  excludeNoisyWebImages:  { type: GraphQLBoolean },
  minimumSizeInCentimetres: { type: GraphQLInt },
  maximumSizeInCentimetres: { type: GraphQLInt },
  possessionLimit: { type: GraphQLInt },
  possessionNotes:  { type: GraphQLString },
  hasPossessionSpecialCase: { type: GraphQLBoolean },
  isNoTakeSpecies: { type: GraphQLBoolean },
  closedSeasonNotes: { type: GraphQLString },
  sourceUrl: { type: GraphQLString },
  imageUrls: { type: new GraphQLList(new GraphQLNonNull(GraphQLString)) },
  edibilityRating: { type: GraphQLFloat },
  eatingNotes: { type: GraphQLString },
  idNotes: { type: GraphQLString },
  scrapedSizeNotes: { type: GraphQLString },
  scrapedPossessionLimits: { type: new GraphQLList(new GraphQLNonNull(GraphQLString)) },
  scrapedPossessionNotes: { type: GraphQLString },
  scrapedSizeLimits: { type: new GraphQLList(new GraphQLNonNull(GraphQLString)) },
};

const SpeciesType = new GraphQL.GraphQLObjectType({
  name: "Species",
  description: "Species Type for all species used in the API.",
  fields
});

export default SpeciesType;
