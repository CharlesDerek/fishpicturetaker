import os
import csv
import argparse
from generate_darknetfiles_for_open_images import get_classes


def parse_args():
    parser = argparse.ArgumentParser(description='Convert open image bounding box annotations into darknet annotations.')
    parser.add_argument('annotations_path', help='the path to the open images bounding box annotations file.')
    parser.add_argument('classes_path', help='the path to list of classes.')
    parser.add_argument('output_dir', help='the path to output the darknet files.')
    return parser.parse_args()

def get_bounding_boxes(path, classes):
    label_names_to_descriptions = get_label_names_to_descriptions()
    boxes = []
    with open(path, 'r') as csvFile:
        reader = csv.reader(csvFile, delimiter=',')
        image_id_index = 0; label_name_index = 2; xmin_index = 4; xmax_index = 5; ymin_index = 6; ymax_index = 7
        for row in reader:
            label_name = row[label_name_index]
            if label_name in label_names_to_descriptions:
                class_name = label_names_to_descriptions[label_name]
                if class_name in classes:
                    box = {
                        "image_id": row[image_id_index],
                        "class_index": classes.index(class_name),
                        "xmin": float(row[xmin_index]),
                        "xmax": float(row[xmax_index]),
                        "ymin": float(row[ymin_index]),
                        "ymax": float(row[ymax_index]),
                    }
                    boxes.append(box)
    return boxes

def get_label_names_to_descriptions():
    label_names_to_descriptions = {}
    with open('./fish-open-images-class-descriptions-boxable-subset.csv', 'r') as csvFile:
        reader = csv.reader(csvFile, delimiter=',')
        for name, description in reader:
            label_names_to_descriptions[name] = description
    return label_names_to_descriptions

def generate_darknet_files(output_dir, bounding_boxes):
    image_ids_to_bounding_boxes = {}
    for box in bounding_boxes: 
        image_id = box["image_id"]
        if not image_id in image_ids_to_bounding_boxes:
            image_ids_to_bounding_boxes[image_id] = []
        image_ids_to_bounding_boxes[image_id].append(box)

    for image_id in image_ids_to_bounding_boxes.keys(): 
        with open(os.path.join(output_dir, image_id + ".txt"), "w") as f:
            for box in image_ids_to_bounding_boxes[image_id]:
                dn_box = convert_box(box["xmin"], box["ymin"], box["xmax"], box["ymax"])
                f.write("%s %s %s %s %s\n" % (box["class_index"], dn_box[0], dn_box[1], dn_box[2], dn_box[3]))

def convert_box(xmin, ymin, xmax, ymax):
    x = (xmin + xmax) / 2.0
    y = (ymin + ymax) / 2.0
    width = xmax - xmin
    height = ymax - ymin
    return (x, y, width, height)

def main():
    args = parse_args()
    classes = get_classes(args.classes_path)
    bounding_boxes = get_bounding_boxes(args.annotations_path, classes)
    generate_darknet_files(args.output_dir, bounding_boxes)

if __name__ == '__main__':
    main()
