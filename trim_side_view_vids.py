#!/usr/bin/env python
import os
import sys
import ffmpeg
import pathlib


def get_duration(file):
    try:
        probe = ffmpeg.probe(file)
    except ffmpeg.Error as e:
        print(e.stderr, file=sys.stderr)
        sys.exit(1)
    video_stream = next((stream for stream in probe['streams'] if stream['codec_type'] == 'video'), None)
    if video_stream is None:
        print('No video stream found', file=sys.stderr)
        sys.exit(1)
    return float(video_stream['duration'])

def trim(file, output):
    duration = get_duration(file)
    start_time = 12
    end_time = float(duration) - 16 - start_time
    return ffmpeg.input(file, ss=start_time).output(output, to=end_time, c='copy', an=None)

def remove_audio(file, output):
    return ffmpeg.input(file).output(output, c='copy', an=None)

def process_files():
    if len(sys.argv) != 2:
        print('Usage: python trim_side_view_vids.py <folder_name> e.g. 2025-01-01')
        sys.exit(1)
    folder_name = sys.argv[1]
    folder = f'/Users/david.williams/Movies/skydiving/{folder_name}'
    files = list(pathlib.Path(folder).rglob('source0*.mp4'))
    os.makedirs(os.path.join(folder, 'processed'), exist_ok=True)

    for file in files:
        print(f'Processing {file}')
        split_path = os.path.split(file)
        output = os.path.realpath(os.path.join(split_path[0], '../processed', split_path[1]))
        if split_path[1].startswith('source01'):
            stream = trim(file, output)
        elif split_path[1].startswith('source02'):
            stream = remove_audio(file, output)
        else:
            return
        print(stream.compile())
        stream.run(overwrite_output=True)

if __name__ == '__main__':
    process_files()
