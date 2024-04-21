cd ~/Movies/skydiving/2024-01-23/
sftp david@pi:/home/david/projects/skydiving-video-library/public/video-data/pending <<EOF
put source02*.mp4
exit
EOF
