import os
import argparse
from PIL import Image
from common import *

def parse_args():
    parser = argparse.ArgumentParser(description='Extract bounding box images from a set of images.')
    parser.add_argument('annotation_dir', help='the path to the base directory that contains annotation files.')
    parser.add_argument('image_dir', help='the path the base directory that contains the images to extract the bounding boxes from.')
    parser.add_argument('output_dir', help='the path the base directory that the extracted images will be created in.')
    return parser.parse_args()

def get_files_recursively(path):
    paths = []
    for root, dirs, files in os.walk(path):
        paths = paths + [os.path.join(root, f) for f in files]
    return paths

def extract_bounding_boxes(annotation_dir, image_dir, output_dir):
    for path in get_files_recursively(annotation_dir):
        with open(path) as f:
            bounding_boxes = [get_bounding_box(line) for line in f]
            image_path = replicate_folder_structure_and_change_file(path, annotation_dir, image_dir, "jpg")
            output_path = replicate_folder_structure(image_path, image_dir, output_dir)
            extract_bounding_box_from_image(image_path, bounding_boxes, output_path)

def get_bounding_box(line):
    class_index, x, y, width, height = line.split(" ")
    return float(x), float(y), float(width), float(height)

def dn_box_to_pil_box(image_size, dn_box):
    x, y, width, height = dn_box
    return int((x - (width / 2.0)) * image_size[0]), int((y - (height / 2.0)) * image_size[1]), int((x + (width / 2.0)) * image_size[0]), int((y + (height / 2.0)) * image_size[1])

def extract_bounding_box_from_image(image_path, bounding_boxes, output_dir):
    image = Image.open(image_path)
    file_name_and_ext = image_path.split(os.sep)[-1]
    file_name, ext = os.path.splitext(file_name_and_ext)

    for i, box in enumerate(bounding_boxes):
        pil_box = dn_box_to_pil_box(image.size, box)
        croppped_image = adjust_size_for_model(image.crop(pil_box))
        cropped_path = os.path.join(output_dir, "%s_%s%s" % (file_name, i, ext))
        croppped_image.save(cropped_path)
        print(cropped_path)

def fill_scale_for_model(image):
    # Attribution: https://stackoverflow.com/a/44231784/137996
    x, y = image.size
    size = max(x, y)
    new_im = Image.new('RGB', (size, size), (0, 0, 0))
    new_im.paste(image, ((size - x) / 2, (size - y) / 2))

    input_size = 299 # 224
    return new_im.resize((input_size, input_size))

adjust_size_for_model = fill_scale_for_model

def append_to_file_name(file_name, suffix):
    name, ext = os.path.splitext(file_name)
    return name + suffix + ext

if __name__ == "__main__":
    args = parse_args()
    extract_bounding_boxes(args.annotation_dir, args.image_dir, args.output_dir)
