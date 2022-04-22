import os
import argparse
import math
import datetime
from keras.preprocessing.image import ImageDataGenerator
from keras import backend as K
import tensorflow as tf
from data import *
from metrics import *
from model import *
from training import *

# https://stackoverflow.com/a/23575424/137996
from PIL import ImageFile
ImageFile.LOAD_TRUNCATED_IMAGES = True

def main():
    args = parse_args()
    training_dir = os.path.join(args.dataset_path, "training")
    classes_to_sizes = get_classes_to_sizes(training_dir)
    n_classes = len(classes_to_sizes.keys())
    model_name = os.path.basename(args.model_path) if args.model_path != None else args.model_name
    model, output_node_name, image_size, n_new_layers = get_model(args.model_path, args.model_name, n_classes)

    # Normalise the RGB values to what the model expects.
    data_gen = ImageDataGenerator(rescale=1/255)

    training_generator = flow_from_directory(data_gen, training_dir, image_size)
    validation_generator = flow_from_directory(data_gen, os.path.join(args.dataset_path, "validation"), image_size)

    print("Train new layers")
    freeze_layers(model, len(model.layers) - n_new_layers)
    compile(model, n_classes)
    train(model, training_generator, validation_generator, patience=args.patience)

    print("Train all layers")
    for layer in model.layers:
       layer.trainable = True

    compile(model, n_classes)
    training_acc = train(model, training_generator, validation_generator, patience=args.patience)

    dataset_name = os.path.basename(os.path.normpath(args.dataset_path))
    instance_name = "%s_%s" % (datetime.datetime.today().strftime('%Y-%m-%d_%H:%M'), dataset_name)
    output_dir = os.path.join(args.output_path, instance_name)
    save_model(model, output_dir, model_name, output_node_name, get_classes(training_generator))

    print("Calculating metrics")
    val_evaluation_tuples = evaluate_model(model, validation_generator)
    create_class_performance_file("./results/%s.csv" % instance_name, training_acc, val_evaluation_tuples, classes_to_sizes)

    if args.eval_test:
        test_generator = flow_from_directory(data_gen, os.path.join(args.dataset_path, "testing"), image_size)
        loss, acc = model.evaluate_generator(test_generator, test_generator.n // test_generator.batch_size)
        print("Test acc:", acc)

def parse_args():
    parser = argparse.ArgumentParser(description='Transform the fish datasets into a structure appropriate for training the model.')
    parser.add_argument('--dataset_path', help='the path that contains the dataset folders.', required=False, default=os.path.join(os.environ['DERIVED_DATASETS_PATH'], 'transformed_fish_dataset'))
    parser.add_argument('--model_name', help='the name of the model to fine tune.', required=False, default="mobilenetv2")
    parser.add_argument('--model_path', help='the path of the model to fine tune.', required=False, default=None)
    parser.add_argument('--output_path', help='the path to output the files to.', required=False, default="/home/ashley/fishpic_models/")
    parser.add_argument('--eval_test', help='evaluate the test dataset.', action='store_true')
    parser.add_argument('--patience', help='How many epochs it should take until the training process stops', type=int, default=3)
    return parser.parse_args()

def get_model(model_path, model_name, n_classes):
    if model_path != None:
        return load_model(model_path, n_classes)
    if model_name != None:
        if model_name == 'mobilenetv2':
            return create_mobilenetv2(n_classes)
        elif model_name == 'inceptionv3':
            return create_inceptionv3(n_classes)
        else:
            raise Exception("Unknown model.")
    else:
        raise Exception('Either model_name or model_path are required.')

if __name__ == '__main__':
    main()
