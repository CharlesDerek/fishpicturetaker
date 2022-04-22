import os
from os.path import join, isfile, splitext
from shutil import rmtree
import json
import argparse
from utils import copy_files

def main():
    args = parse_args()
    output_path = args.output_path

    if os.path.exists(output_path):
        print("Deleting:", output_path)
        rmtree(output_path)

    species = read_species_json_file(args.species_json_path)
    
    # walk through the dataset and if the class name exists in the dict, copy it into a new dir with the official class name.
    change_and_output_classes(args.dataset_path, output_path, species)
 
def change_and_output_classes(dataset_path, output_path, species):
    scientific_names_to_class_names = {}
    for species_dict in species:
        if species_dict['excludeNoisyWebImages'] != True:
            scientific_names_to_class_names[species_dict['scientificName']] = species_dict['className']
    print("Number of names: " + str(len(scientific_names_to_class_names)))

    for root, dirs, files in os.walk(dataset_path):
        scientific_name = os.path.basename(root)
        if scientific_name in scientific_names_to_class_names:
            new_class_name = scientific_names_to_class_names[scientific_name]
            scientific_names_to_class_names.pop(scientific_name, None)
            print('Changing %s to %s' % (scientific_name, new_class_name))
            dest_dir = join(output_path, new_class_name)
            copy_files([join(root, x) for x in files], dest_dir)
    
    print("Scientific names not changed: " + str(scientific_names_to_class_names.keys()))

def parse_args():
    parser = argparse.ArgumentParser(description='Change the class names of a set of classes into an output path.')
    parser.add_argument('--dataset_path', help='the path for the dataset.', default=os.path.join(os.environ['FISHPIC_DATASETS_PATH'], 'noisy_web_images'))
    parser.add_argument('--species_json_path', help='the path to the species json file.', default='../FishApp/assets/fish.json')
    parser.add_argument('--output_path', help='the path to output the changed classes.', default=os.path.join(os.environ['FISHPIC_DATASETS_PATH'], 'supported_species_noisy_web_images'))
    return parser.parse_args()

def read_species_json_file(species_json_path):
    print("Reading species JSON file")
    with open(species_json_path, "r") as f:
    	return json.loads(f.read())

if __name__ == "__main__":
    main()
