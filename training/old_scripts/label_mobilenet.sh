python3 label_mobilenet.py \
  --graph=./tf/mobilenet_1.0.224_quantized.pb \
  --labels=./tf/output_labels.txt \
  --image=$1
