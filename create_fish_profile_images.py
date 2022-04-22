import os
from os.path import join, splitext
import re
from shutil import copy2
from PIL import Image


def main():
    profile_images_dir = os.path.join(os.environ['FISHPIC_DATASETS_PATH'], "fish_profile_images")
    output_dir = "./FishApp/assets/images/fish/"
    class_names_to_file_names = get_class_names_to_file_names(profile_images_dir)
    
    for class_name, file_names in sorted(class_names_to_file_names.items(), key=lambda a: a[0]):
        file_names.sort()
        print("    case '%s':" % class_name)
        print("      return [")
        thumbnail_file_name = create_thumbnail_name(file_names[0])
        scale_image(
            join(profile_images_dir, file_names[0]),
            join(output_dir, thumbnail_file_name),
            max_width=160, 
            max_height=400
        )
        require_str = "        require('../../assets/images/fish/%s'),"
        print(require_str % thumbnail_file_name)

        # For now we are only using the first image in the set of images to decrease the APK size.
        for file_name in file_names[:1]:
            # let's aim for 1334 x 750 pixels images.
            scale_image(
                join(profile_images_dir, file_name),
                join(output_dir, file_name),
                max_width=1334, 
                max_height=750
            )
            print(require_str % file_name)
        print("      ]")

def get_class_names_to_file_names(path):
    modified_image_regex = r"^(\w+?)(_\d+)?_modified.\w{3}$"
    match_index = 0
    group_index = 0
    class_names_to_file_names = {}
    for file_name in os.listdir(path):
        matches = list(re.finditer(modified_image_regex, file_name))
        if len(matches) != 0:
            match = matches[match_index]
            class_name = match.groups()[group_index]
            if not class_name in class_names_to_file_names:
                class_names_to_file_names[class_name] = []
            class_names_to_file_names[class_name].append(file_name)
    return class_names_to_file_names

def create_thumbnail_name(file_name):
    split_file_name = list(splitext(file_name))
    index_after_file_name = 1
    split_file_name.insert(index_after_file_name, "_thumbnail")
    return "".join(split_file_name)

def scale_image(src, dest, max_width, max_height):
    try:
        image = Image.open(src)
        width, height = image.size
        if width > max_width or height > max_height:
            ratio = min(max_width / width, max_height / height)
            scaled_width = int(width * ratio)
            scaled_height = int(height * ratio)
            image = image.resize((scaled_width, scaled_height), Image.BICUBIC)
            #print("width", width, "height", height, "scaled_width", scaled_width, "scaled_height", scaled_height)
        image.save(dest, optimise=True)
    except IOError:
        print("Failed to create image at %s." % dest)

if __name__ == "__main__":
    main()
