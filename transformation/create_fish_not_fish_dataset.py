import os
import csv
import argparse
from shutil import copy2


def main():
    args = parse_args()
    n_fish_images = copy_fish_images(args.fish_pic_dir, args.fish_not_fish_dir)
    copy_not_fish_images(args.open_images_dir, args.fish_not_fish_dir, n_fish_images)

def parse_args():
    parser = argparse.ArgumentParser(description='')
    parser.add_argument(
        '--open_images_dir',
        help='the Open Images dataset directory.',
        default='/mnt/hdd/extracted_datasets/Open_Images_Dataset_V4/')
    parser.add_argument(
        '--fish_pic_dir',
        help='the Fishpic dataset directory.',
        default=os.path.join(os.environ['DERIVED_DATASETS_PATH'], 'transformed_fish_dataset'))
    parser.add_argument(
        '--fish_not_fish_dir',
        help='the directory to copy the files to.',
        default=os.path.join(os.environ['DERIVED_DATASETS_PATH'], 'Fish_Not_Fish'))
    return parser.parse_args()

def copy_fish_images(fish_pic_dir, fish_not_fish_dir):
    image_paths = []
    for root, dirs, files in os.walk(fish_pic_dir):
        for file in files:
            if file.endswith(".jpg"):
                image_paths.append(os.path.join(root, file))

    dest_dir = os.path.join(fish_not_fish_dir, "fish")
    copy_files(image_paths, dest_dir)
    return len(image_paths)

def copy_not_fish_images(open_images_dir, fish_not_fish_dir, n_fish_images):
    class_ids = get_class_ids(os.path.join(open_images_dir, "class-descriptions-boxable.csv"))
    image_ids = get_image_ids_only_with_class_ids(os.path.join(open_images_dir, "train-annotations-human-imagelabels-boxable.csv"), class_ids)
    dest_dir = os.path.join(fish_not_fish_dir, "not_fish")
    image_paths = [os.path.join(open_images_dir, "train", image_id + ".jpg") for image_id in image_ids ]
    actual_image_paths = list(filter(lambda a: os.path.isfile(a), image_paths))
    copy_files(actual_image_paths[:n_fish_images], dest_dir)

def copy_files(file_paths, destination_dir):
    if not os.path.isdir(destination_dir):
        os.makedirs(destination_dir)

    for path in file_paths:
        copy2(path, destination_dir)
        print("Copied", path)

def get_class_ids(path):
    descriptions_to_omit = set([
        "Sea turtle",
        "Tortoise",
        "Starfish",
        "Goldfish",
        "Marine invertebrates",
        "Whale",
        "Turtle",
        "Fish",
        "Lobster",
        "Jellyfish",
        "Marine mammal",
        "Sea path",
        "Crab",
        "Seahorse",
    ])
    ids = [id for id, description in get_class_ids_to_descriptions(path).items()
           if not description in descriptions_to_omit]
    return set(ids)

def get_class_ids_to_descriptions(path):
    ids_to_descriptions = {}
    with open(path, 'r') as csvFile:
        reader = csv.reader(csvFile, delimiter=',')
        for row in reader:
            id, description = row
            ids_to_descriptions[id] = description
    return ids_to_descriptions

def get_image_ids_only_with_class_ids(path, class_ids):
    return [image_id for image_id, image_class_ids in get_image_ids_to_class_ids(path).items()
            if len(set(image_class_ids) - class_ids) == 0]

def get_image_ids_to_class_ids(path):
    image_ids_to_class_ids = {}
    with open(path, 'r') as csvFile:
        reader = csv.reader(csvFile, delimiter=',')
        # Skip the header row.
        for image_id, source, label_name, confidence in list(reader)[1:]:
            if not image_id in image_ids_to_class_ids:
                image_ids_to_class_ids[image_id] = []
            image_ids_to_class_ids[image_id].append(label_name)
    return image_ids_to_class_ids

if __name__ == "__main__":
    main()
