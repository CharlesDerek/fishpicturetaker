import keras.callbacks
import numpy as np

def train(model, training_generator, validation_generator, patience = 3):
    history = model.fit_generator(
        training_generator,
        steps_per_epoch=training_generator.n//training_generator.batch_size // 2,
        validation_data=validation_generator,
        validation_steps=validation_generator.n//validation_generator.batch_size,
        epochs=1000,
        callbacks=[keras.callbacks.EarlyStopping(monitor='val_categorical_accuracy', patience=patience, restore_best_weights=True)])
    training_acc = history.history['categorical_accuracy'][-1]
    return training_acc
