bazel build tensorflow/tools/graph_transforms:transform_graph
bazel-bin/tensorflow/tools/graph_transforms/transform_graph \
  --inputs="input_1" \
  --in_graph=/home/ashley/code/fish/tf_camera_example/data/mobilenet_1.0_224_quantized.pb \
  --outputs="final_result" \
  --out_graph=/tmp/quantized_graph.pb \
  --transforms='add_default_attributes strip_unused_nodes(type=float, shape="-1,128,64,1") remove_nodes(op=CheckNumerics) fold_constants(ignore_errors=true) fold_batch_norms fold_old_batch_norms quantize_nodes round_weights strip_unused_nodes sort_by_execution_order'
