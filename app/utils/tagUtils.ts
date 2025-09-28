import {type Dirent, WriteStream, createWriteStream} from "fs";
import { unlink, rename } from "fs/promises";
import {Conversion, FilePathSource, Input, MP4, Mp4OutputFormat, Output, StreamTarget} from "mediabunny";

export async function readTag(path: string): Promise<TagData> {
    const input = new Input({
        formats: [MP4],
        source: new FilePathSource(path),
    });

    const metadata = await input.getMetadataTags()
    return {
        title: metadata.title,
        artist: metadata.artist,
        date: metadata.date?.toDateString(),
        comment: metadata.comment,
    }
}

export async function writeTag(path: string, tags: TagData): Promise<void> {
    const tempPath = path + '.tmp'
    const input = new Input({
        formats: [MP4],
        source: new FilePathSource(path),
    })

    const stream = WriteStream.toWeb(createWriteStream(tempPath))
    const output = new Output({
        format: new Mp4OutputFormat(),
        target: new StreamTarget(stream, { chunked: true, chunkSize: 2**20}),
    })
    try {
        const conversion = await Conversion.init({
            input,
            output,
            tags: (inputTags) => ({
                ...inputTags,
                title: tags.title,
                artist: tags.artist,
                date: new Date(tags.date!),
                comment: tags.comment,
            })
        })
        await conversion.execute()
        await unlink(path)
        await rename(tempPath, path)
    } catch (err) {
        console.error("Unable to write tags", err)
    } finally {
        await unlink(tempPath).catch(() => { /* ignore */ })
    }
}

export type VideoData = {
    formationIds: string[];
    flyers: string[];
    date?: Date | null;
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
