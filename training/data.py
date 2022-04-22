import os
from collections import Counter
import numpy as np

def flow_from_directory(data_generator, path, size, shuffle=True):
    return data_generator.flow_from_directory(
	path,
	target_size=(size, size),
	batch_size=32,
	class_mode="categorical",
	shuffle=shuffle,
	seed=42)

def get_classes_to_sizes(path):
    classes_to_sizes = {}
    for root, dirs, files in os.walk(path):
        for file in files:
            if file.endswith('.jpg'):
                class_name = os.path.basename(root)
                if not class_name in classes_to_sizes:
                    classes_to_sizes[class_name] = 0
                classes_to_sizes[class_name] += 1
    return classes_to_sizes

# Attribution: https://stackoverflow.com/a/42587192/137996
def get_class_weights(generator):
    counter = Counter(generator.classes)                          
    max_val = float(max(counter.values()))       
    return {class_id : max_val/num_images for class_id, num_images in counter.items()}                     

def get_y_true(generator, steps):
    y_true = []
    for i in range(steps):
        X_batch, y_true_batch = next(generator)
        y_true = y_true + np.argmax(y_true_batch, axis=1).tolist()
    return y_true

def get_classes(generator):
    return list(map(lambda a: a[0], sorted(generator.class_indices.items(), key=lambda a: a[1])))

def save_labels(labels, path):
    with open(path, "w") as f:
        for label in labels:
            f.write(label + "\n")
