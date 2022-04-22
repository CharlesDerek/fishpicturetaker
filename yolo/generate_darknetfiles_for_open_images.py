import os
from os import listdir
import argparse
import xml.etree.ElementTree
from shutil import copyfile
from common import convert_box, get_classes


def parse_args():
    parser = argparse.ArgumentParser(description='Convert open image annotations into darknet annotations.')
    parser.add_argument('open_images_path', help='the path to the open images dataset.')
    parser.add_argument('classes_path', help='the path to the classes.')
    return parser.parse_args()

def convert_file(file_path, image_id, output_dir, classes):
    root = xml.etree.ElementTree.parse(file_path).getroot()
    size = root.find("size")
    width = find_int(size, "width")
    height = find_int(size, "height")
    has_valid_class = False
    txt_path = os.path.join(output_dir, image_id + ".txt") 
    with open(txt_path, "w") as output_file:
        for obj in root.iter("object"):
            name = obj.find("name").text
            if not name in classes:
                print("Class doesn't exist:", name)
                break
            class_index = classes.index(name)
            has_valid_class = True
            box = obj.find("bndbox")
            xmin = find_float(box, "xmin")
            ymin = find_float(box, "ymin")
            xmax = find_float(box, "xmax")
            ymax = find_float(box, "ymax")
            converted_box = convert_box(width, height, xmin, ymin, xmax, ymax)
            output_file.write("%s %s %s %s %s\n" % (class_index, converted_box[0], converted_box[1], converted_box[2], converted_box[3]))

    if not has_valid_class:
        os.remove(txt_path)

    return has_valid_class

def find_int(element, name):
    return int(element.find(name).text)

def find_float(element, name):
    return float(element.find(name).text)


if __name__ == "__main__":
    args = parse_args()
    oi_path = args.open_images_path
    print("Classes:", classes)
    datasets = ["train", "validation", "test"]
    classes = get_classes(args.classes_path)
    for dataset in datasets:
        image_ids = set()
        dataset_dir = os.path.join(oi_path, dataset)
        anno_dir = os.path.join(oi_path, dataset + "_anns")
        if os.path.exists(anno_dir):
            with open(os.path.join(oi_path, dataset + ".txt"), "w") as list_f:
                for anno_file in listdir(anno_dir):
                    image_id, ext = os.path.splitext(anno_file)
                    anno_file_path = os.path.join(anno_dir, anno_file)
                    is_valid_file = False
                    if not os.path.isfile(os.path.join(dataset_dir, image_id + ".jpg")):
                        pass # If the image doesn't exist, ignore the annotation file.
                    elif ext == ".txt":
                        print("Copying", anno_file_path)
                        copyfile(anno_file_path, os.path.join(dataset_dir, anno_file))
                        is_valid_file = True
                    elif ext == ".xml":
                        print("Converting", anno_file_path)
                        is_valid_file = convert_file(anno_file_path, image_id, dataset_dir, classes)
                    else:
                        raise Exception("Unknown extension") 
                    
                    if is_valid_file:
			list_f.write("%s\n" % os.path.join(oi_path, dataset, "%s.jpg" % image_id))
			image_ids.add(image_id)

            for image_file_name in listdir(os.path.join(oi_path, dataset)):
                image_id, _ = os.path.splitext(image_file_name)
                if not image_id in image_ids:
                    path = os.path.join(oi_path, dataset, image_file_name)
                    print("Deleting", path)
                    os.remove(path)
