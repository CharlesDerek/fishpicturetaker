import os
from shutil import rmtree, copy2
import csv
import json

def get_csv_dicts(file_path):
    with open(file_path, "r") as csv_file:
        reader = csv.reader(csv_file, delimiter=",", quotechar="\"")
        dicts = []
        header_row = None
        for row in reader:
            if header_row == None:
                header_row = row
            else:
                dict = {}
                for key, value in zip(header_row, row):
                    parsed_value = None 
                    if value != "":
                        if value.isdigit():
                            parsed_value = int(value)
                        else:
                            parsed_value = value
                            try:
                                parsed_value = float(value)
                            except:
                                pass
                    dict[key] = parsed_value
                dicts.append(dict)
        return dicts 

def convert_csv_into_json(csv_file, output_file):
    data = get_csv_dicts(csv_file)
    with open(output_file, "w") as f:
        json.dump(data, f)

def copy_files(file_paths, destination, refresh=False):
    if refresh and os.path.exists(destination):
        rmtree(destination)

    if not os.path.isdir(destination):
        os.makedirs(destination)

    for file_path in file_paths:
        copy2(file_path, destination) 