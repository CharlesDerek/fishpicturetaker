import os
from os.path import join, isfile, splitext
import argparse
from shutil import rmtree, copy2
import math
import numpy as np
from utils import copy_files

def main():
    args = parse_args()
    output_dir = args.output_path

    print("Deleting:", output_dir)
    if os.path.exists(output_dir):
        rmtree(output_dir)

    training_dir = join(output_dir, "training")
    validation_dir = join(output_dir, "validation")
    testing_dir = join(output_dir, "testing")
    class_names_to_training_file_paths = split_files(
            args.dataset_path, training_dir, validation_dir, testing_dir, args.omit_small_classes)
    print("Finished splitting datasets.")

def parse_args():
    parser = argparse.ArgumentParser(description='Split a dataset into a structure appropriate for training the model.')
    parser.add_argument('dataset_path', help='the path for the fish datasets.')
    parser.add_argument('output_path', help='the path to output the split datasets.')
    parser.add_argument('--omit_small_classes', help='a flag that controls whether small classes that don\'t have enough images are omitted or not.', default=True)
    return parser.parse_args()

def split_files(source_dir, training_dir, validation_dir, testing_dir, omit_small_classes):
    class_names_to_training_file_paths = {}

    for class_dir in sorted(os.listdir(source_dir)):
        print("Splitting %s" % class_dir)
        class_dir_path = join(source_dir, class_dir)
        class_files = os.listdir(class_dir_path)
        validation_percentage = 10
        testing_percentage = 10
        n_validation_files = max(1, math.ceil(len(class_files) * validation_percentage  / 100))
        n_testing_files = max(1, math.ceil(len(class_files) * testing_percentage  / 100))
        n_training_files = len(class_files) - n_validation_files - n_testing_files
        #print(n_training_files, n_validation_files, n_testing_files)
        if n_training_files <= 0:
            if omit_small_classes:
                print("Skipping", class_dir)
                continue
            else:
                n_validation_files = 0
                n_training_files = 1
        class_file_paths = set([ join(source_dir, class_dir, x) for x in class_files ])
        # Set the random's seed to a constant value so that images are split the same way everytime this script is executed.
        # The training set split will change the moment a set of images for a particular fish changes unfortunately.
        random_state = np.random.RandomState(42)
        # sort these files so that they are in a consistent order which is important.
        validation_file_paths = set(random_state.choice(sorted(class_file_paths), n_validation_files))
        class_file_paths = class_file_paths - validation_file_paths
        testing_file_paths = set(random_state.choice(sorted(class_file_paths), n_testing_files))
        class_file_paths = class_file_paths - testing_file_paths
        #print(len(class_file_paths), n_training_files)
        #assert(len(class_file_paths) == n_training_files)
        training_file_paths = class_file_paths
        # Refresh the folders it in case the list of files has changed. We can't have one file added to more than one set.
        copy_files(validation_file_paths, join(validation_dir, class_dir), refresh=True)
        copy_files(testing_file_paths, join(testing_dir, class_dir), refresh=True)
        copy_files(training_file_paths, join(training_dir, class_dir), refresh=True)

        class_names_to_training_file_paths[class_dir] = training_file_paths
    #rmtree(source_dir)
    return class_names_to_training_file_paths

if __name__ == "__main__":
    main()
