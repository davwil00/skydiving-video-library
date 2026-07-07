import { data } from 'react-router';
import { VIDEO_DATA_PATH } from '~/routes/sync-db';
import type { FileToTag } from '~/state/tag-reducer';
import { determineViewFromFilename, writeTag } from '~/utils/tagUtils';
import type { Route } from './+types/tag';

export type TagProgressEvent =
    | { type: 'started'; total: number }
    | {
          type: 'progress';
          completed: string[];
          total: number;
          currentFile: string;
      }
    | {
          type: 'error';
          completed: string[];
          total: number;
          currentFile: string;
          message: string;
      }
    | { type: 'done'; completed: string[]; total: number; hasErrors: boolean };

export const action = async ({ request }: Route.ActionArgs) => {
    if (request.method !== 'POST') {
        return data({ message: 'Method not allowed', status: 405 });
    }

    const url = new URL(request.url);
    const videoDataPath =
        url.searchParams.get('dir') || `${VIDEO_DATA_PATH}/pending`;

    const formData: { filesToTag: FileToTag[] } = await request.json();

    const writes = formData.filesToTag.flatMap((fileToTag) => {
        const tasks: Array<{ fileName: string; data: FileToTag }> = [];
        if (fileToTag.sideVideoFileName) {
            tasks.push({
                fileName: fileToTag.sideVideoFileName,
                data: fileToTag,
            });
        }
        if (fileToTag.topVideoFileName) {
            tasks.push({
                fileName: fileToTag.topVideoFileName,
                data: fileToTag,
            });
        }
        return tasks;
    });

    const total = writes.length;
    const encoder = new TextEncoder();
    const completed: string[] = [];
    let hasErrors = false;

    const stream = new ReadableStream({
        async start(controller) {
            const send = (event: TagProgressEvent) => {
                controller.enqueue(
                    encoder.encode(`${JSON.stringify(event)}\n`),
                );
            };

            send({ type: 'started', total });

            for (const writeTask of writes) {
                try {
                    await writeTag(`${videoDataPath}/${writeTask.fileName}`, {
                        title: writeTask.data.formations || '',
                        artist: writeTask.data.flyers || '',
                        date: writeTask.data.date || '',
                        comment: determineViewFromFilename(writeTask.fileName),
                    });
                    completed.push(writeTask.fileName);
                    send({
                        type: 'progress',
                        completed,
                        total,
                        currentFile: writeTask.fileName,
                    });
                } catch (error) {
                    hasErrors = true;
                    completed.push(writeTask.fileName);
                    const message =
                        error instanceof Error ? error.message : `${error}`;
                    console.error(error);
                    send({
                        type: 'error',
                        completed,
                        total,
                        currentFile: writeTask.fileName,
                        message,
                    });
                }
            }

            send({ type: 'done', completed, total, hasErrors });
            controller.close();
        },
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'application/x-ndjson; charset=utf-8',
            'Cache-Control': 'no-cache',
        },
    });
};
