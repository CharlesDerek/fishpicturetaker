const fishes = require("../../assets/fish.json");

console.log("Processing fish data.");
const classNamesToFishes = fishes.reduce((dict, fish) => {
  dict[fish.className] = fish;
  return dict;
}, {});

const allFish = Object.values(classNamesToFishes).sort((a, b) => a.className.localeCompare(b.className));
console.log("Finished processing fish data.");

export function getFishData(className) {
  const fish = classNamesToFishes[className];
  if (fish === undefined) {
    throw `This fish is not in our database: ${className}.`;
  }
  return fish;
}

export function getAllFishData() {
  return allFish;
}
