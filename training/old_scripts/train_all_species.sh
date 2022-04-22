. env/bin/activate
python3 retrain.py \
  --image_dir $DERIVED_DATASETS_PATH/split_all_species_images/ \
  --architecture=inception_v3 \
  --output_graph=./models/all_species_inception_v3.pb \
  --output_labels=./models/all_species_inception_v3_labels.txt \
  --how_many_training_steps=100000 \
  --print_misclassified_test_images
