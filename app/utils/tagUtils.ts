// @ts-ignore
import ffmetadata from "ffmetadata";

export function readTag(path: string): Promise<TagData> {
  return new Promise((resolve, reject) => {
    ffmetadata.read(path, (err: any, data: TagData) => {
      if (err) {
        console.error("Error reading tags", err)
        reject(err)
      }
      resolve(data)
    });
  })
}

export function writeTag(path: string, tags: TagData): Promise<void> {
  return new Promise((resolve, reject) => {
    ffmetadata.write(path, tags, (err: any) => {
      if (err) {
        console.error("Error writing tag", err)
        reject(err)
      }
      resolve()
    })
  })
}

export type TagData = {
  title?: string
  artist?: string
  date?: string
  comment?: string
}
