import os
from os.path import join, isfile
import argparse
import re
from shutil import copyfile, rmtree
from PIL import Image
import json


parser = argparse.ArgumentParser(description='Extract bounding box images from a set of images.')
parser.add_argument('bounding_box_data', help='the path to the bounding box data file.')
parser.add_argument('img_dir', help='the path the directory that contains the images to extract the bounding boxes from.')
parser.add_argument('output_dir', help='the path the directory that the extracted images will be created in.')

def get_bounding_boxes(file_path):
    with open(file_path) as f:
        # Assume that it's a label box JSON file.
        data = json.load(f)
        label_name = "Barred Javelin"
        # This code assumes only one bounding box per image.
        return map(lambda a: { "FileName": a["External ID"], "Geometry": a["Label"][label_name][0]["geometry"]}, data)

def extract_bounding_boxes(bounding_boxes, img_dir, output_dir):
    for bounding_box in bounding_boxes:
        file_name = bounding_box["FileName"]
        path = join(img_dir, file_name)
        image = Image.open(path)
        box = label_box_geometry_to_pil_box(bounding_box["Geometry"])
        #print("Image size:", image.size)
        #print(bounding_box["Geometry"])
        #print(box)
        cropped_image = image.crop(box)
        # This assume that this is only one bounding box per image
        output_path = join(output_dir, append_to_file_name(file_name, "_0"))
        cropped_image.save(output_path)
        print("Extracted bounding box to:", output_path)

def label_box_geometry_to_pil_box(geometry):
    x_values = set(map(lambda a: a["x"], geometry))
    y_values = set(map(lambda a: a["y"], geometry))
    n_expected_values = 2
    assert(len(x_values) == n_expected_values)
    assert(len(y_values) == n_expected_values)
    return (min(x_values), min(y_values), max(x_values), max(y_values))

def append_to_file_name(file_name, suffix):
    name, ext = os.path.splitext(file_name)
    return name + suffix + ext

if __name__ == "__main__":
    args = parser.parse_args()
    bounding_boxes = get_bounding_boxes(args.bounding_box_data)
    extract_bounding_boxes(bounding_boxes, args.img_dir, args.output_dir)
