import os
import csv
from shutil import copyfile
from constants import *

label_names = None
with open('./fish-open-images-class-descriptions-boxable-subset.csv', 'rb') as csvFile:
    reader = csv.reader(csvFile, delimiter=',')
    label_name_index = 0;
    label_names = frozenset([row[label_name_index] for row in reader])
print("labels:")
print(label_names)

extracted_image_ids = []
with open(training_annotations_path , 'rb') as csvFile:
    reader = csv.reader(csvFile, delimiter=',')
    image_id_index = 0
    label_name_index = 2
    for row in reader:
        if row[label_name_index] in label_names:
            extracted_image_ids.append(row[image_id_index])

#extracted_image_ids = extracted_image_ids[:5]
print("Number of images to extract:", len(extracted_image_ids))

# Copy training images to extract dir.
training_dir = os.path.join(fish_extracted_dataset_dir, "train")
if not os.path.isdir(training_dir):
    os.makedirs(training_dir)

for image_id in extracted_image_ids:
    file_name = "%s.jpg" % image_id 
    src_path = os.path.join(open_images_training_dir, file_name)
    copyfile(src_path, os.path.join(training_dir, file_name))

# Copy training annotations to extract dir. 
training_annotations_dir = os.path.join(fish_extracted_dataset_dir, "train_anns")
if not os.path.isdir(training_annotations_dir):
    os.makedirs(training_annotations_dir)

for image_id in extracted_image_ids:
    file_name = "%s.xml" % image_id 
    src_path = os.path.join(open_images_training_anns_dir, file_name)
    if os.path.isfile(src_path):
        copyfile(src_path, os.path.join(training_annotations_dir, file_name))

