import os
import csv
from constants import *

label_names = frozenset([
    "/m/01cmb2",
    "/m/01d40f",
    "/m/01gkx_",
    "/m/01gmv2",
    "/m/01r546",
    "/m/02wv6h6",
    "/m/03bt1vf",
    "/m/04tn4x",
    "/m/04yqq2",
    "/m/065h6l",
    "/m/06k2mb",
    "/m/0b_rs",
    "/m/0h8mhzd",
])

def delete_images(annotations_path, image_dir, anns_dir):
    image_ids = []
    with open(annotations_path , 'r') as csvFile:
        reader = csv.reader(csvFile, delimiter=',')
        image_id_index = 0
        label_name_index = 2
        for row in reader:
            if row[label_name_index] in label_names:
                image_ids.append(row[image_id_index])
    print("Number of images to delete:", len(image_ids))
    count = 0
    for image_id in image_ids:
        file_name = "%s.jpg" % image_id 
        src_path = os.path.join(image_dir, file_name)
        if os.path.isfile(src_path):
            os.remove(src_path)
            count += 1
    print("Number of images deleted:", count)

    for image_id in image_ids:
        file_name = "%s.xml" % image_id 
        src_path = os.path.join(anns_dir, file_name)
        if os.path.isfile(src_path):
                os.remove(src_path)

delete_images(training_annotations_path, open_images_training_dir, open_images_training_anns_dir)
delete_images(validation_annotations_path, open_images_validation_dir, open_images_validation_anns_dir)
delete_images(test_annotations_path, open_images_test_dir, open_images_test_anns_dir)
