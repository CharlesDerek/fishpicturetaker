import os


def get_classes(path):
    with open(path, "r") as f:
        return list(map(lambda a: a.strip(), f))

def create_darknet_annotation_file(image_path, annotation_path, width, height, dn_boxes, classes):
    with open(annotation_path, "w") as output_file:
        for dn_box in dn_boxes:
            name = dn_box["class_name"]
            if not name in classes:
                print("Class doesn't exist:", name)
                break
            class_index = classes.index(name)
            box_tuple = dn_box_to_box_tuple(dn_box)
            converted_box = convert_box(width, height, box_tuple[0], box_tuple[1], box_tuple[2], box_tuple[3])
            output_file.write("%s %s %s %s %s\n" % (class_index, converted_box[0], converted_box[1], converted_box[2], converted_box[3]))

def dn_box_to_box_tuple(dn_box):
    b = dn_box
    left_x = b["left_x"]
    top_y = b["top_y"]
    return left_x, top_y, left_x + b["width"], top_y + b["height"]

def convert_box(width, height, xmin, ymin, xmax, ymax):
    x = ((xmin + xmax) / 2.0 - 1) / float(width)
    y = ((ymin + ymax) / 2.0 - 1) / float(height)
    new_width = (xmax - xmin) / float(width)
    new_height = (ymax - ymin) / float(height)
    return (x, y, new_width, new_height)

def replicate_folder_structure(path, base_dir, output_dir):
    path_difference = path.replace(base_dir, "")
    folder_path = os.path.join(output_dir, os.path.dirname(path_difference))
    if not os.path.isdir(folder_path):
        os.makedirs(folder_path)
    return folder_path

def replicate_folder_structure_and_change_file(path, base_dir, output_dir, file_ext = "txt"):
    folder_path = replicate_folder_structure(path, base_dir, output_dir)
    file_name_and_ext = path.split(os.sep)[-1]
    file_name, ext = os.path.splitext(file_name_and_ext)
    return os.path.join(folder_path, file_name + "." + file_ext)