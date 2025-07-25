// @ts-expect-error no types exist for this package
import ffmetadata from "ffmetadata";
import type {Dirent} from "fs";

export function readTag(path: string): Promise<TagData> {
  return new Promise((resolve, reject) => {
    ffmetadata.read(path, (err: unknown, data: TagData) => {
      if (err) {
        console.error("Error reading tags", err)
        return reject(err)
      }
      return resolve(data)
    });
  })
}

export function writeTag(path: string, tags: TagData): Promise<void> {
  return new Promise((resolve, reject) => {
    ffmetadata.write(path, tags, (err: unknown) => {
      if (err) {
        console.error("Error writing tag", err)
        return reject(err)
      }
      return resolve()
    })
  })
}

export type VideoData = {
  formationIds: string[];
  flyers: string[];
  date: Date | null;
  view: string;
};

export async function processFile(file: Dirent, path: string): Promise<VideoData | undefined> {
  if (file.isFile() && (file.name.endsWith(".mp4") || file.name.endsWith(".av1"))) {
    console.log("processing file", file.name)
    const tags = await readTag(`${path}/${file.name}`)
    const delimiter = tags.title?.includes(',') ? ',' : ''
    const title: string[] = tags.title?.split(delimiter) || [];
    return {
      formationIds: title,
      flyers: tags.artist?.split("/") || [],
      date: tags.date ? new Date(tags.date) : null,
      view: tags.comment!
    };
  }
}

export type TagData = {
  title?: string
  artist?: string
  date?: string
  comment?: string
}

export function extractIdFromFileName(fileName: string) {
  if (fileName.startsWith('source')) {
    return fileName.substring(9)
  }

  return fileName
}

export function determineViewFromFilename(fileName: string) {
  return fileName.startsWith('source01') ? 'SIDE' : 'TOP';
}
