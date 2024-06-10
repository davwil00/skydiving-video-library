// @ts-expect-error no types exist for this package
import ffmetadata from "ffmetadata";

export function readTag(path: string): Promise<TagData> {
  return new Promise((resolve, reject) => {
    ffmetadata.read(path, (err: unknown, data: TagData) => {
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
    ffmetadata.write(path, tags, (err: unknown) => {
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
