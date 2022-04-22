import csv
from os import listdir
from os.path import isfile, join, splitext

# TODO: delete this script if it is no longer used.
fish_urls_path = "../../datasets/fish_urls/"
collectors_to_process = ["ash", "leena", "masud", "gilbert"]

class_names_to_collectors = {}

for f in listdir(fish_urls_path):
    if isfile(join(fish_urls_path, f)) and (f.endswith("csv") or f.endswith("txt")):
        file_name_index = 0
        file_name = splitext(f)[file_name_index]
        parts = file_name.split("_")
        collector_name = parts[-1] 
        class_name = " ".join(parts[:len(parts) - 1])
        if class_name != "":
            if not class_name in class_names_to_collectors:
                class_names_to_collectors[class_name] = []
            class_names_to_collectors[class_name].append(collector_name)

with open("classes_collected.csv", "w") as csv_file:
    writer = csv.writer(csv_file, delimiter=",", quotechar="'")
    writer.writerow(["class name"] + collectors_to_process)
    for class_name, collectors in class_names_to_collectors.items():
        writer.writerow([class_name] + [("done" if c in collectors else "") for c in collectors_to_process])
