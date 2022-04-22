import os
import numpy as np
from keras.preprocessing.image import ImageDataGenerator
from data import flow_from_directory
from PIL import Image

def main():
    data_gen = ImageDataGenerator()
    training_dir = os.path.join(os.environ['FISHPIC_DATASETS_PATH'], 'benchmark')
    image_size = 224
    training_generator = flow_from_directory(data_gen, training_dir, image_size)
    images, _ = next(training_generator)
    for i, pixels in enumerate(images):
        image = Image.new("RGB", (image_size, image_size))
        reshaped_pixels = [tuple(pixel) for pixel in np.reshape(pixels, (-1, 3))]
        image.putdata(reshaped_pixels)
        path = '%s.jpg' % i
        image.save(path)
        print(path)


if __name__ == '__main__':
    main()
