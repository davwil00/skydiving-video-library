cd ~/Movies/skydiving/2024-01-23
mkdir compressed
for file in *.mp4;
  do ffmpeg -hwaccel videotoolbox -i "$file" -c:v libsvtav1 -an -crf 28 "compressed/$file";
done
