import os
from keras.applications.inception_v3 import InceptionV3
from keras.applications.mobilenet_v2 import MobileNetV2
from keras.models import Model
from keras.layers import Dense, GlobalAveragePooling2D
from keras.metrics import categorical_accuracy
from keras import backend as K
import keras.optimizers
from metrics import *


def create_inceptionv3(n_classes):
    base_model = InceptionV3(weights='imagenet', include_top=False)
    model, output_node_name, n_new_layers = add_fc_layer_and_output_layer(base_model, n_classes)
    image_size = 299
    return model, output_node_name, image_size, n_new_layers

def create_mobilenetv2(n_classes):
    image_size = 224
    input_shape = (image_size, image_size, 3)
    # alpha=1.4 has the best results from what I read, but I get OOM errors for alpha=1.4.
    base_model = MobileNetV2(input_shape=input_shape, alpha=1.3, weights='imagenet', include_top=False)
    model, output_node_name, n_new_layers = add_fc_layer_and_output_layer(base_model, n_classes)
    return model, output_node_name, image_size, n_new_layers

def load_model(path, n_classes):
    base_model = keras.models.load_model(path)
    print(base_model.layers[-1])
    print(base_model.output)
    #base_model.summary()
    base_model.layers.pop()
    base_model.layers.pop()
    #base_model.summary()
    # Rename the last two layers otherwise we will get a name clash when add a new dense layer below.
    #base_model.layers[-2].name = base_model.layers[-2].name + '_original'
    #base_model.layers[-1].name = base_model.layers[-1].name + '_original'
    predictions = add_output_layer(base_model.layers[-1].output, n_classes)
    # this is the model we will train
    new_model = Model(inputs=base_model.input, outputs=predictions)
    #new_model.summary()
    image_size = 224 # Assume that its a mobilenetv2 model.
    n_new_layers = 1
    return new_model, 'dense_1/Softmax', image_size, n_new_layers

def add_fc_layer_and_output_layer(base_model, n_classes):
    # add a global spatial average pooling layer
    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    predictions = add_output_layer(x, n_classes)
    # this is the model we will train
    n_new_layers = 2
    return Model(inputs=base_model.input, outputs=predictions), 'dense_2/Softmax', n_new_layers

def add_output_layer(input, n_classes):
    # let's add a fully-connected layer
    x = Dense(n_classes, activation='relu')(input)
    # and a logistic layer
    predictions = Dense(n_classes, activation='softmax')(x)
    return predictions


def freeze_layers(model, n_layers):
    # at this point, the top layers are well trained and we can start fine-tuning
    # convolutional layers from inception V3. We will freeze the bottom N layers
    # and train the remaining top layers.

    # let's visualize layer names and layer indices to see how many layers
    # we should freeze:
    #for i, layer in enumerate(base_model.layers):
    #   print(i, layer.name)

    # we chose to train the top 2 inception blocks, i.e. we will freeze
    # the first 249 layers and unfreeze the rest:
    print("Freezing %s out of %s layers" % (n_layers, len(model.layers)))
    for layer in model.layers[:n_layers]:
       layer.trainable = False
    for layer in model.layers[n_layers:]:
       layer.trainable = True

def compile(model, n_classes):
    #def w_acc(y_true, y_pred):
    #    return weighted_accuracy(n_classes, y_true, y_pred)

    model.compile(
        #optimizer=keras.optimizers.RMSprop(lr=0.00001),
        optimizer=keras.optimizers.SGD(lr=0.01, momentum=0.85, decay=0.001),
        #optimizer=keras.optimizers.Adam(lr=0.0001),
        #optimizer=keras.optimizers.Adagrad(lr=0.001, decay=0.001),
        #optimizer=keras.optimizers.Adadelta(lr=0.01),
        loss='categorical_crossentropy',
        metrics=[categorical_accuracy])

def save_model(model, output_dir, model_name, output_node_name, classes):
    saver = tf.train.Saver()
    #saver.save(K.get_session(), checkpoint_path)
    sess = K.get_session()
    frozen_graph = freeze_session(sess, output_names=[out.op.name for out in model.outputs])
    #graph_def = tf.graph_util.convert_variables_to_constants(sess, sess.graph_def, [ output_node_name ])
    os.makedirs(output_dir)
    pb_path = os.path.join(output_dir, '%s.pb' % model_name)
    with tf.gfile.GFile(pb_path, 'wb') as f:
        f.write(frozen_graph.SerializeToString())
    print("Saved to", pb_path)
    hdf5_path = os.path.join(output_dir, '%s.h5py' % model_name)
    keras.models.save_model(model, hdf5_path, include_optimizer=False)
    print("Saved to", hdf5_path)
    save_labels(classes, os.path.join(output_dir, "labels.txt"))
    saver = tf.train.Saver()
    saver_path = saver.save(sess, os.path.join(output_dir, "%s.ckpt" % model_name))
    print("Saved to", saver_path)

def freeze_session(session, keep_var_names=None, output_names=None, clear_devices=True):
    """
    Freezes the state of a session into a pruned computation graph.

    Creates a new computation graph where variable nodes are replaced by
    constants taking their current value in the session. The new graph will be
    pruned so subgraphs that are not necessary to compute the requested
    outputs are removed.
    @param session The TensorFlow session to be frozen.
    @param keep_var_names A list of variable names that should not be frozen,
                          or None to freeze all the variables in the graph.
    @param output_names Names of the relevant graph outputs.
    @param clear_devices Remove the device directives from the graph for better portability.
    @return The frozen graph definition.
    """
    graph = session.graph
    with graph.as_default():
        freeze_var_names = list(set(v.op.name for v in tf.global_variables()).difference(keep_var_names or []))
        output_names = output_names or []
        output_names += [v.op.name for v in tf.global_variables()]
        input_graph_def = graph.as_graph_def()
        if clear_devices:
            for node in input_graph_def.node:
                node.device = ""
        frozen_graph = tf.graph_util.convert_variables_to_constants(
            session, input_graph_def, output_names, freeze_var_names)
        return frozen_graph
