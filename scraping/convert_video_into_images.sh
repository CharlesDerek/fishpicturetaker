# www.savethevideo.com
# the second parameter must include "%04d.jpg".
#ffmpeg -i $1 -qscale:v 2 $2 -hide_banner
# Try using the scale parameter
# scale=300:-1 for a maximum width of 300 pixels.
ffmpeg -i $FISHPIC_DATASETS_PATH/fish_videos/bigeye_trevally/3090191053_700.mp4 -qscale:v 2 -vf fps=1 $DERIVED_DATASETS_PATH/fish_video_frames/bigeye_trevally/3090191053_700_%04d.jpg -hide_banner
ffmpeg -i $FISHPIC_DATASETS_PATH/fish_videos/cobia/www.youtube.com_watch?v=CKFztdciOdI_clipped.mp4 -qscale:v 2 -vf fps=1 $DERIVED_DATASETS_PATH/fish_video_frames/cobia/www.youtube.com_watch?v=CKFztdciOdI_clipped_%04d.jpg -hide_banner
