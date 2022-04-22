import os

dataset_dir = '/mnt/hdd/datasets/Open_Images_Dataset_V4'
training_annotations_path = os.path.join(dataset_dir, 'train-annotations-bbox.csv')
validation_annotations_path = os.path.join(dataset_dir, 'validation-annotations-bbox.csv')
test_annotations_path = os.path.join(dataset_dir, 'test-annotations-bbox.csv')

extracted_dataset_dir = '/mnt/hdd/extracted_datasets'
fish_extracted_dataset_dir = os.path.join(extracted_dataset_dir, 'fish_open_images')

open_images_training_dir = os.path.join(extracted_dataset_dir, 'Open_Images_Dataset_V4/train/')
open_images_training_anns_dir = os.path.join(extracted_dataset_dir, 'Open_Images_Dataset_V4/train_anns/')

open_images_validation_dir = os.path.join(extracted_dataset_dir, 'Open_Images_Dataset_V4/validation/')
open_images_validation_anns_dir = os.path.join(extracted_dataset_dir, 'Open_Images_Dataset_V4/validation_anns/')

open_images_test_dir = os.path.join(extracted_dataset_dir, 'Open_Images_Dataset_V4/test/')
open_images_test_anns_dir = os.path.join(extracted_dataset_dir, 'Open_Images_Dataset_V4/test_anns/')
