cd ~/Movies/skydiving/2023-12-12/side
for file in *.mp4;
  do ffmpeg -hwaccel videotoolbox -i "$file" -c:v libsvtav1 -an -crf 28 "compressed/$file";
done
