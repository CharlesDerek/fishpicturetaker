const GraphQL = require('graphql');
const schema = require('../graphql/schema');
const { ApolloServer, gql } = require('apollo-server-lambda');


const server = new ApolloServer({
    schema,
    context: async context => {
        console.log(`Context: ${JSON.stringify(context)}.`);
        return { identity: context.event.requestContext.identity, key: context.event.headers["x-key"], headers: context.event.headers };
    },
    formatError: error => {
        console.log(error);
        return error;
    },
});
exports.main = server.createHandler({
    cors: {
        origin: '*'
    },
});










import { getAllSpecies, updateSpecies } from '../graphql/resolvers/Species';

/*
(async () => {
    console.log("Starting schema migration.");
    const species = await getAllSpecies();
    for (let i = 0; i < species.length; i++) {
        const aSpecies = species[i];
        const updatedSpecies = { ...aSpecies, excludeNoisyWebImages: aSpecies.supportedInAppVersion === '0.1.13' };
        await updateSpecies(updatedSpecies);
        console.log(aSpecies.id);
    }
    console.log("Finished schema migration.");
})();
*/

/*
// Add support version to species with given scientific names.
const str = `
Choerodon cyanodus
Epinephelus cyanopodus
Scleropages jardinii
Diagramma pictum
Lutjanus carponotatus
Epinephelus fasciatus
Epinephelus lanceolatus
Lutjanus lemniscatus
Lethrinus erythracanthus
Plectropomus laevis
Lutjanus malabaricus
Hephaestus tulliensis
Lethrinus miniatus
Platichthys stellatus
Zabidius novemaculeatus
Eubalichthys bucephalus
Opistognathus papuensis
Plectorhinchus gibbosus
Psammoperca waigiensis
Synanceia verrucosa
Toxotes chatareus
Drepane punctata
Thunnus thynnus
Megalops cyprinoides
Scolopsis monogramma
Lobotes surinamensis
Photopectoralis bindus
Carangoides gymnostethus
Feroxodon multistriatus
Selenotoca multifasciata
Alectis indica
Batrachomoeus trispinosus
Tripodichthys angustifrons
Plectorhinchus flavomaculatus
`;

const scientificNames = str.split("\n").map(x => x.trim()).filter(x => x !== '');
console.log("scientificNames: " + scientificNames.length);

(async () => {
    console.log("Starting schema migration.");
    const species = await getAllSpecies();
    for (let i = 0; i < species.length; i++) {
        const data = species[i];
        const index = scientificNames.indexOf(data.scientificName);
        if (index !== -1) {
            const updatedSpecies = { ...data, supportedInAppVersion: '0.1.18' };
            await updateSpecies(updatedSpecies);
            console.log(data.id);
            scientificNames.splice(index, 1);
        }
    }
    console.log("Finished schema migration.");
    console.log(JSON.stringify(scientificNames));
})();
*/

/*
const str = `
`;
const importedData = str.split("\n").map(x => x.split(',').map(y => y.trim().replace(';', ',')));
console.log("fish: " + importedData.length);
console.log(importedData);
const commonNames = importedData.map(x => x[0]);

(async () => {
    console.log("Starting schema migration.");
    const species = await getAllSpecies();
    for (let i = 0; i < species.length; i++) {
        const aSpecies = species[i];
        let edibilityRating = null;
        let eatingNotes = null;
        let idNotes = null;
        const index = commonNames.indexOf(aSpecies.commonName);
        if (index !== -1) {
            console.log(importedData[index]);
            edibilityRating = importedData[index][1] || null;
            console.log("ER:"+ edibilityRating);
            if (edibilityRating !== null) {
                edibilityRating = parseFloat(edibilityRating);
            }
            eatingNotes = importedData[index][2] || null;
            idNotes = importedData[index][3] || null;
            console.log("ER:"+ edibilityRating);
            importedData.splice(index, 1);
            commonNames.splice(index, 1);
            const updatedSpecies = { ...aSpecies, edibilityRating, eatingNotes, idNotes };
            await updateSpecies(updatedSpecies);
            console.log(aSpecies.id);
        }
    }
    console.log("Finished schema migration.");
    console.log(JSON.stringify(commonNames));
})();
*/

/*
(async () => {
    console.log("Starting schema migration.");
    const species = await getAllSpecies();
    for (let i = 0; i < species.length; i++) {
        const { isSupported, ...rest } = species[i];
        const updatedSpecies = { ...rest, supportedInAppVersion: null };
        await updateSpecies(updatedSpecies);
        console.log(rest.id);
    }
    console.log("Finished schema migration.");
})();
*/

// Upload Species data.
/*
const uuid = require("uuid");
import species from './daf_fish.json';

let done = false;

if (!done) {
    species.forEach(x => {
        const idNotes = x["id notes"];
        delete x["id notes"];
        x.idNotes = idNotes;
        x.id = uuid.v1();
        SpeciesController.mutationIndex({ species: x }, null);
    });
    done = true;
}
*/