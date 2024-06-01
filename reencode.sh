cd ~/Movies/skydiving/2024-05-23
mkdir processed
for file in source01*.mp4;
  do ffmpeg -hwaccel videotoolbox -i "$file" -c:v libsvtav1 -an -crf 28 "processed/$file";
done

for file in source02*.mp4;
  do ffmpeg -i "$file" -c copy -an "processed/$file";
done
