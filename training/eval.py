import os
import argparse
import tensorflow as tf
import keras
from keras.preprocessing.image import ImageDataGenerator
import numpy as np
from data import *
from model import *

def main():
    args = parse_args()

    """
    with tf.Session() as sess:
        with tf.python.platform.gfile.FastGFile(args.model_path, 'rb') as f:
            graph_def = tf.GraphDef()
            graph_def.ParseFromString(f.read())
        tf.import_graph_def(graph_def, name='')
    """
    print("Loading", args.model_path)
    model = keras.models.load_model(args.model_path)
    compile(model, 78)

    data_gen = ImageDataGenerator(rescale=1/255)
    training_generator = flow_from_directory(data_gen, os.path.join(os.environ['DERIVED_DATASETS_PATH'], 'transformed_fish_dataset', 'training'), 224)
    classes = get_classes(training_generator)
    eval_generator = data_gen.flow_from_directory(args.dataset_path, (224, 224), classes=classes, class_mode='categorical', shuffle=False)
    
    loss, acc = model.evaluate_generator(eval_generator, steps=1)
    print("Accuracy:", acc)

    predictions = model.predict_generator(eval_generator, steps=1)
    for pred in predictions:
        index = np.argmax(pred)
        print(classes[index], "(%s):" % index, pred[index])

def parse_args():
    parser = argparse.ArgumentParser(description='Evaluates a model for a given dataset.')
    parser.add_argument('--model_path', help='the path for the model.', required=False, default="/tmp/mobilenetv2.h5py")
    parser.add_argument('--dataset_path', help='the path to the dataset.', required=False, default="/tmp/fish_benchmark/")
    return parser.parse_args()

if __name__ == '__main__':
    main()
