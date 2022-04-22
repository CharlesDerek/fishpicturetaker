bazel build tensorflow/python/tools:strip_unused && \
bazel-bin/tensorflow/python/tools/strip_unused \
  --input_graph=/home/ashley/code/tensorflow/tensorflow/examples/android/assets/inceptionv3.pb \
  --output_graph=/home/ashley/code/tensorflow/tensorflow/examples/android/assets/inceptionv3_stripped.pb \
  --input_node_names=Mul \
  --output_node_names=final_result \
  --input_binary=true
