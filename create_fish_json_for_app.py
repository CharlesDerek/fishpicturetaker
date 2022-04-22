import json
import re

from transformation.utils import get_csv_dicts


with open("./data/daf_fish.json", "r") as f:
    daf_fish = sorted(json.load(f), key=lambda x: x["commonName"])

print("%s DAF Fish." % len(daf_fish))

fish_edibility_list = get_csv_dicts("./data/fish_edibility.csv")
print("%s fish edibility ratings." % len(fish_edibility_list))

common_names_to_fish_edibility_data = {}
for x in fish_edibility_list:
    common_names_to_fish_edibility_data[x["commonName"]] = x

with open("./FishApp/android/app/src/main/assets/labels.txt", "r") as f:
    class_names_to_export = set(map(lambda a: a.strip(), f.readlines())) - { 'beach' }

fish_to_export = []
for fish in daf_fish:
    common_name = fish["commonName"]
    fish["className"] = re.sub(r" +", "_", re.sub(r"[-()]", " ", common_name.lower()).strip())
    #print(fish["className"])
    if fish["className"] in class_names_to_export:
        if common_name in common_names_to_fish_edibility_data:
            fish.update(common_names_to_fish_edibility_data[common_name])
        else:
            print("No edibility data for %s." % common_name)
        # TODO: remove unneeded attributes here.
        fish_to_export.append(fish)

daf_fish_names = set([x['className'] for x in daf_fish])
missing_fish_names = class_names_to_export - daf_fish_names - {'boat', 'indoors', 'sea', 'river', 'people'}
if len(missing_fish_names) != 0:
    print("Fish that are missing from the image dataset that were not exported:", missing_fish_names) 

with open("./FishApp/assets/fish.json", "w") as f:
    json.dump(fish_to_export, f)

print("%s fish exported." % len(fish_to_export))
