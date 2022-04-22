import os
import sys
import re
import argparse
from PIL import Image
from common import create_darknet_annotation_file, get_classes, replicate_folder_structure_and_change_file


def parse_args():
    parser = argparse.ArgumentParser(description='Create annotation files from darknet test output.')
    parser.add_argument('base_dir', help='the path for the base directory of the images that will be replicated in the output.')
    parser.add_argument('output_dir', help='the path to save the cropped images.')
    parser.add_argument('classes_path', help='the path to the classes.')
    return parser.parse_args()

def get_path(line):
    regex = r"^[\w ]*?: (.*?):[ \w\d\.-]*$"
    match = re.search(regex, line)
    if match == None:
        if line == "Enter Image Path: ":
            return None
        else:
            raise Exception("No match for: " + line)
    else:
        file_path_group_index = 0
        return match.groups()[file_path_group_index]

def get_bounding_box(line):
    regex = r"^(\w*?): (\d*)%\s*\([\w_]*:\s*([-\d]*)\s*[\w_]*:\s*([-\d]*)\s*\w*:\s*(\d*)\s*\w*:\s*(\d*)\)$"
    match = re.search(regex, line)
    if match == None:
        match = re.search("^(\w*?): (\d*)%", line)
        if match == None:
            return None
        class_name, confidence = match.groups()
        return { "class_name": class_name, "confidence": confidence }
    else:
        class_name, confidence, left_x, top_y, width, height = match.groups()
        return {
            "class_name": class_name,
            "confidence": float(confidence),
            "left_x": int(left_x),
            "top_y": int(top_y),
            "width": int(width),
            "height": int(height),
        }

def get_annotations_from_input_stream():
    i = 0
    lines_to_skip = 3
    path = None
    boxes = []
    for line in sys.stdin:
        if i >= lines_to_skip:
            print(line.strip())
            bounding_box = get_bounding_box(line)
            if bounding_box != None and not "left_x" in bounding_box:
                # copy the bounding box values from the most recent bounding box.
                new_box = {}
                new_box.update(boxes[-1])
                new_box.update(bounding_box)
                bounding_box = new_box

            if bounding_box == None:
                if path != None and len(boxes) != 0:
                    yield (path, boxes)
                path = get_path(line)
                boxes = []
            else:
                boxes.append(bounding_box)
            #print(path, bounding_box)
        i += 1

def create_annotation_file(path, bounding_boxes, base_dir, output_dir, classes):
    classes_to_extract = ["Fish"]
    width, height = get_image_dimensions(path)
    dn_boxes = filter(lambda a: a["class_name"] in classes_to_extract, bounding_boxes)
    create_darknet_annotation_file(path, replicate_folder_structure_and_change_file(path, base_dir, output_dir), width, height, dn_boxes, classes)

def get_image_dimensions(path):
    return Image.open(path).size

if __name__ == "__main__":
    args = parse_args()
    classes = get_classes(args.classes_path)
    for path, boxes in get_annotations_from_input_stream():
        create_annotation_file(path, boxes, args.base_dir, args.output_dir, classes)
