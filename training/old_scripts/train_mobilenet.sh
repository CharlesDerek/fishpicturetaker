. env/bin/activate
python3 retrain.py \
  --image_dir $DERIVED_DATASETS_PATH/transformed_fish_dataset \
  --architecture=mobilenet_1.0_224_quantized \
  --output_graph=./models/mobilenet_1.0.224_quantized.pb \
  --output_labels=./models/mobilenet_labels.txt \
  --how_many_training_steps=5000 \
  --print_misclassified_test_images
