#!/bin/bash
folder='/Users/david.williams/Movies/skydiving/2025-05-08/session1'
file='karen-concat2.mp4'

trim_video() {
  startTime='5'
  duration=5
  ffmpeg -ss "$startTime" -i "$folder/$file" -an -c copy -to "$duration" "$folder/karen-concat2.mp4"
}

reverse_video() {
  ffmpeg -i "$folder/$file" -vf reverse "$folder/karen-reversed.mp4"
}

concat_video() {
  file1="$folder/karen.mp4"
  file2="$folder/karen-reversed.mp4"
  mkfifo temp1 temp2
  ffmpeg -y -i "$file1" -c copy -bsf:v h264_mp4toannexb -f mpegts temp1 2> /dev/null & \
  ffmpeg -y -i "$file2" -c copy -bsf:v h264_mp4toannexb -f mpegts temp2 2> /dev/null & \
  ffmpeg -f mpegts -i "concat:temp1|temp2" -c copy -bsf:a aac_adtstoasc "$folder/karen-concat.mp4"
}

gif_video() {
  ffmpeg -i "$folder/$file" -filter_complex "[0:v] fps=12,scale=w=480:h=-1,split [a][b];[a] palettegen [p];[b][p] paletteuse"  "$folder/karen.gif";
}
gif_video
