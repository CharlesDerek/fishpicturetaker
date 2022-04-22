import os
import tensorflow as tf
from keras.preprocessing.image import ImageDataGenerator
from tensorflow.python.platform import gfile
from data import *

def main():
    # Attribution: https://stackoverflow.com/a/50652415/137996
    GRAPH_PB_PATH = '../models/quantized_graph.pb'
    with tf.Session() as sess:
        print("load graph")
        with gfile.FastGFile(GRAPH_PB_PATH,'rb') as f:
            graph_def = tf.GraphDef()
        graph_def.ParseFromString(f.read())
        sess.graph.as_default()
        input_tensor, output_tensor = tf.import_graph_def(graph_def, name='', return_elements=['input_1:0', 'dense_2/Softmax'])
        #print(input_tensor, output_tensor)
        """
        graph_nodes=[n for n in graph_def.node]
        names = []
        for t in graph_nodes:
            names.append(t.name)
        print(names)
        """
        data_gen = ImageDataGenerator(rescale=1/255)
        validation_generator = flow_from_directory(data_gen, os.path.join(os.environ['DERIVED_DATASETS_PATH'], 'transformed_fish_dataset', 'validation'), 224)
        for i in range(validation_generator.n // validation_generator.batch_size):
            X, y = next(validation_generator)
            #print(X.shape)
            output_value = sess.run(output_tensor, feed_dict={input_tensor: X})
            print(output_value)
            break

if __name__ == '__main__':
    main()
