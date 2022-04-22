import os
from os.path import join, isfile
import argparse
import re
from shutil import copyfile, rmtree
from PIL import Image


parser = argparse.ArgumentParser(description='Convert any non jpeg images into jpeg.')
parser.add_argument('img_dir', help='the path for the image directory')

args = parser.parse_args()

def convert_images(img_dir):
    regex = r"^([\w~]+)\.(\w{3})$" # some files have tildes randomly in the file name.
    for file_name in os.listdir(img_dir):
        path = join(img_dir, file_name) 
        if not isfile(path):
            convert_images(path)
            continue
        try:
            matches = re.finditer(regex, file_name.replace(" ", "")) # Some file names have spaces in them accidentally.
            name, file_ext = next(matches).groups()
            if not file_ext in ["jpg", "jpeg"]:
                print(path)
                output_path = join(img_dir, "%s.jpg" % name)
                # Attribution: https://stackoverflow.com/a/123212/137996
                #copyfile(path, output_path)
                im = Image.open(path).convert('RGB')
                im.save(output_path)
                os.remove(path)
                print("Converted file to:", output_path, ".")
        except StopIteration:
            pass

convert_images(args.img_dir)
print("Finished converting images.")
