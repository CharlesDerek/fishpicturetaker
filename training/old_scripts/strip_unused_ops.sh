bazel build tensorflow/python/tools:strip_unused && \
bazel-bin/tensorflow/python/tools/strip_unused \
  --input_graph=/home/ashley/code/fish/tf_camera_example/data/inceptionv3_stripped.pb \
  --output_graph=/home/ashley/code/fish/tf_camera_example/data/inceptionv3_stripped2.pb \
  --input_node_names=Mul \
  --output_node_names=final_result \
  --input_binary=true
