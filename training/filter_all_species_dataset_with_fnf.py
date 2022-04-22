import os
from shutil import copy2
import argparse
import tensorflow as tf
import keras
from keras.preprocessing.image import ImageDataGenerator
import numpy as np
from data import *
from model import *

# https://stackoverflow.com/a/23575424/137996
from PIL import ImageFile
ImageFile.LOAD_TRUNCATED_IMAGES = True

def main():
  args = parse_args()
  delete_empty_files(args.dataset_path)
  evaluations = evaluate_dataset(args.model_path, args.dataset_path)
  filter_fish_images_and_output_not_fish_to_file(
    evaluations,
    args.dataset_path,
    args.output_path)

def delete_empty_files(path):
  for root, dirs, files in os.walk(path):
    for f in files:
      fullname = os.path.join(root, f)
      if os.path.getsize(fullname) == 0:
        print(fullname)
        os.remove(fullname)

def evaluate_dataset(model_path, dataset_path):
  print("Loading model", model_path)
  model = keras.models.load_model(model_path)
  classes = ["fish", "not_fish"]
  compile(model, len(classes))

  print("Loading dataset", dataset_path)
  data_gen = ImageDataGenerator(rescale=1/255)
  image_size = 224
  dataset_generator = flow_from_directory(data_gen, dataset_path, image_size, shuffle=False)

  batch_size = dataset_generator.batch_size
  for X_batch, y_batch in dataset_generator:
    predictions = model.predict(X_batch, batch_size)
    starting_index = (dataset_generator.batch_index - 1) * batch_size
    file_names = dataset_generator.filenames[starting_index : starting_index + batch_size]
    for file_name, pred in zip(file_names, predictions):
      index = np.argmax(pred)
      yield (file_name, classes[index])

    percentage = (dataset_generator.batch_index + 1) / len(dataset_generator) * 100
    print("%6.2f%%" % percentage)
    if percentage == 100.0:
      break

def filter_fish_images_and_output_not_fish_to_file(evaluations, dataset_path, output_path):
  print("Filtering All Species dataset")
  with open(os.path.join(output_path, "not_fish_paths.txt"), "w") as f:
    for relative_path, label in evaluations:
      file_path = os.path.join(dataset_path, relative_path)
      if label == 'fish':
        destination_dir = os.path.join(output_path, os.path.dirname(relative_path))
        if not os.path.isdir(destination_dir):
          os.makedirs(destination_dir)
        copy2(file_path, os.path.join(output_path, relative_path))
      elif label == 'not_fish':
        f.write(file_path + "\n")
      else:
        raise Exception("Unknown class: %s." % label)

def parse_args():
  parser = argparse.ArgumentParser(description='Filter the all species dataset using the Fish Not Fish model.')
  parser.add_argument('--model_path', help='the path for the model.', required=False, default="../models/fnf_mobilenetv2.h5py")
  parser.add_argument('--dataset_path', help='the path to the dataset.', required=False, default=os.path.join(os.environ['FISHPIC_DATASETS_PATH'], 'supported_species_noisy_web_images'))
  parser.add_argument('--output_path', help='the path output the filtered images to.', required=False, default=os.path.join(os.environ['DERIVED_DATASETS_PATH'], 'filtered_supported_species_noisy_web_images'))
  return parser.parse_args()

if __name__ == '__main__':
  main()