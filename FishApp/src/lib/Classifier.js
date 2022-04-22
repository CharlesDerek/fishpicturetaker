export const processClassifierResults = results => {
    if (results === null) {
        throw "Results should not be null.";
    } else if (results.length === 0) {
        throw "Results should not be an empty array value.";
    } else {
        const classificationClass = results[0].class;
        const notFishClasses = ["beach", "boat", "indoors", "people", "river", "sea"];
        if (notFishClasses.indexOf(classificationClass) !== -1) {
            return [];
        } else {
            const confidence = results[0].confidence;
            const confidenceThreshold = 0.95;
            if (confidence >= confidenceThreshold) {
                return [ results[0] ];
            } else {
                return results.map(x => notFishClasses.indexOf(x.class) === -1 ? x : null);
            }
        }
    }
}