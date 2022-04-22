for filename in /mnt/hdd/extracted_datasets/Open_Images_Dataset_V4/train_anns/*; do
  echo $filename
  sed -i -- 's/&/&amp;/g' $filename
done
