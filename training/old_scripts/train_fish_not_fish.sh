. env/bin/activate
python3 retrain.py \
  --image_dir $DERIVED_DATASETS_PATH/Fish_Not_Fish/ \
  --architecture=inception_v3 \
  --output_graph=./models/fnf_inception_v3.pb \
  --output_labels=./models/fnf_inception_v3_labels.txt \
  --how_many_training_steps=3100 \
  --print_misclassified_test_images
