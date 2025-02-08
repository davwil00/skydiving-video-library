file=xxx
ffmpeg -i "${file}.mp4" -filter_complex "[0:v] fps=12,scale=w=480:h=-1,split [a][b];[a] palettegen [p];[b][p] paletteuse"  "processed/${file}.gif";
