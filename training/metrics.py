import tensorflow as tf
import numpy as np
from data import *

def weighted_accuracy(n_classes, y_true, y_pred):
    y_true_index = tf.math.argmax(y_true, axis=1)
    y_pred_index = tf.math.argmax(y_pred, axis=1)
    correctness = tf.cast(tf.equal(y_true_index, y_pred_index), tf.float32)
    class_means = []
    for i in range(n_classes):
        mask = tf.equal(y_true_index, i)
        filtered_correctness = tf.boolean_mask(correctness, mask)
        # if filtered_correctness is an empty list, mean will be nan.
        mean = tf.math.reduce_mean(filtered_correctness)
        class_means.append(mean)
    stacked_means = tf.stack(class_means)
    no_nans_means = tf.boolean_mask(stacked_means, tf.logical_not(tf.is_nan(stacked_means)))
    return tf.math.reduce_mean(no_nans_means)

def print_generator_class_accuracies(model, generator):
    evaluation_tuples = evaluate_model(model, generator)
    print_class_accuracies(evaluation_tuples, get_classes(generator))

def evaluate_model(model, generator):
    steps = generator.n // generator.batch_size

    shuffle = generator.shuffle
    generator.shuffle = False
    generator.reset()
    y_pred = model.predict_generator(generator, steps=steps)
    y_pred = np.argmax(y_pred, axis=1).tolist()

    generator.reset()
    y_true = get_y_true(generator, steps)
    generator.shuffle = shuffle
    return list(zip(y_true, y_pred))

def print_class_accuracies(evaluation_tuples, classes):
    class_performances = create_class_performances(evaluation_tuples, classes)
    for name, size, n_correct, acc in class_performances:
        print("%s: %s%%" % (name.replace("_", " "), acc))

def create_class_performance_file(path, training_acc, val_evaluation_tuples, classes_to_sizes):
    class_performances = create_class_performances(val_evaluation_tuples, sorted(classes_to_sizes.keys()))
    with open(path, "w") as f:
        f.write("class,class size,val size,val n_correct,val accuracy\n")
        for name, val_size, val_n_correct, val_acc in class_performances:
            class_size = classes_to_sizes[name]
            f.write("%s,%s,%s,%s,%6.3f\n" % (name, class_size, val_size, val_n_correct, val_acc))
        f.write("\n")
        f.write("training accuracy,%s\n" % training_acc)
        f.write("validation accuracy,%s\n" % dataset_accuracy(val_evaluation_tuples))
    print("Created", path)

def create_class_performances(evaluation_tuples, classes):
    classes_to_totals = { name: 0 for name in classes }
    classes_to_n_correct_values = { name: 0 for name in classes }
    for truth, pred in evaluation_tuples:
        truth_class = classes[truth]
        classes_to_totals[truth_class] += 1
        if truth == pred:
            classes_to_n_correct_values[truth_class] += 1
    
    return [(name,
            classes_to_totals[name],
            classes_to_n_correct_values[name],
            accuracy(classes_to_n_correct_values[name], classes_to_totals[name]))

            for name in classes]

def accuracy(n_correct, size):
    return (n_correct / size * 100.0) if size != 0 else 0.0

def dataset_accuracy(evaluation_tuples):
    correctness = [1.0 if truth == pred else 0.0 for truth, pred in evaluation_tuples]
    if len(correctness) == 0:
        return 0.0
    else:
        return sum(correctness) / len(correctness)