cd ~/Movies/skydiving/2024-05-08/
sftp david@pi4:/home/david/projects/skydiving-video-library/public/video-data/pending <<EOF
put source02*.mp4
lcd compressed
put source01*.mp4
exit
EOF
