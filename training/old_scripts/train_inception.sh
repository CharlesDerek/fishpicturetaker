. env/bin/activate
LD_LIBRARY_PATH=/usr/local/cuda-8.0/lib64/
python3 retrain.py \
  --image_dir $DERIVED_DATASETS_PATH/transformed_fish_dataset \
  --architecture=inception_v3 \
  --output_graph=./models/inception_v3.pb \
  --output_labels=./models/inception_v3_labels.txt \
  --how_many_training_steps=10000 \
  --print_misclassified_test_images
