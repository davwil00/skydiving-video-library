import { mkdir, readdir, rename } from 'fs/promises';
import { getOrCreateSession } from '~/models/sessions.server';
import { createFlight } from '~/models/flights.server';
import { format } from 'date-fns';
import { data, useActionData, useLoaderData } from 'react-router';
import { extractIdFromFileName, processFile } from '~/utils/tagUtils';
import { type ActionFunctionArgs } from 'react-router';
import { formatDate } from '~/utils/utils';
import { Dirent } from 'fs'

export const VIDEO_DATA_PATH = './public/video-data';

type LabelledDirEnt = {
    formationIds: string[];
    flyers: string[];
    date: Date;
    sideFileName?: string
    topFileName?: string
}

async function groupAndLabelFiles(pendingDir: Dirent[]) {
    const labelledFileData = new Map<string, LabelledDirEnt>
    for (const file of pendingDir) {
        if (file.name.endsWith('.mp4')) {
            console.log(`Found pending video file: ${file.name}`);
            const id = extractIdFromFileName(file.name);
            const videoData = await processFile(file, `${VIDEO_DATA_PATH}/pending`);
            if (videoData && videoData.date) {
                const viewProp = videoData.view === 'SIDE' ? 'sideFileName' : 'topFileName'
                if (labelledFileData.has(id)) {
                    labelledFileData.get(id)![viewProp] = file.name
                } else {
                    labelledFileData.set(id, {
                        ...videoData,
                        date: videoData.date,
                        [viewProp]: file.name
                    })
                }
            } else {
                console.error(`${file.name} is missing a date attribute`)
            }
        }
    }
    return labelledFileData
}

async function processFlightFiles(flight: LabelledDirEnt) {
    const sessionId = await getOrCreateSession(flight.date);
    const dateStr = format(flight.date, 'yyyy-MM-dd');
    const path = `/video-data/library/${dateStr}`
    await createFlight({
        sessionId,
        ...flight,
        sideVideoUrl: flight.sideFileName ? `${path}/${flight.sideFileName}` : undefined,
        topVideoUrl: flight.topFileName ? `${path}/${flight.topFileName}` : undefined,
    });
    const newPath = `${VIDEO_DATA_PATH}/library/${dateStr}`
    await mkdir(newPath, {recursive: true});
    if (flight.sideFileName) {
        await rename(`${VIDEO_DATA_PATH}/pending/${flight.sideFileName}`, `${newPath}/${flight.sideFileName}`);
        console.log(`Processed ${flight.sideFileName})`);
    }
    if (flight.topFileName) {
        await rename(`${VIDEO_DATA_PATH}/pending/${flight.topFileName}`, `${newPath}/${flight.topFileName}`);
        console.log(`Processed ${flight.topFileName})`);
    }
}

export const action = async ({request}: ActionFunctionArgs) => {
    if (request.method !== 'POST') {
        return data({message: 'Method not allowed', title: "", status: 405});
    }

    // search pending folder, read tags and move to library
    const pendingDir = await readdir(`${VIDEO_DATA_PATH}/pending`, {
        withFileTypes: true
    });
    if (pendingDir.length == 0) {
        return data({message: 'Nothing to sync', status: 200});
    }
    const errors = [];

    try {
        const labelledFileData = await groupAndLabelFiles(pendingDir)
        for (const flight of labelledFileData.values()) {
            await processFlightFiles(flight)
        }
    } catch (error) {
        console.error('Error processing file', error);
        errors.push(`Error processing file ${error}`);
    }
    if (errors.length > 0) {
        return data({title: 'Sync failed', message: errors.join(', '), status: 500});
    }
    return data({title: 'Sync complete', message: "Don't forget to sync to AWS", status: 201});
}

export const loader = async () => {
    const pendingDir = await readdir(`${VIDEO_DATA_PATH}/pending`, {
        withFileTypes: true
    });

    const videoDataPromises = pendingDir
        .filter(file => file.name.endsWith('.mp4') || file.name.endsWith('.av1'))
        .map(async file => {
            const videoData = await processFile(file, `${VIDEO_DATA_PATH}/pending`);
            if (videoData === undefined) {
                return null;
            } else {
                return {
                    fileName: file.name,
                    ...videoData
                };
            }
        });
    const videoData = [];
    for (const promise of videoDataPromises) {
        const resolved = await promise;
        videoData.push(resolved);
    }
    return {videoData};
};

export default function SyncDb() {
    const {videoData} = useLoaderData<typeof loader>();
    const actionData = useActionData<typeof action>()

    if (actionData) {
        return (
            <>
                <h1>{actionData.title}</h1>
                <p>{actionData.message}</p>
            </>
        )
    }

    return (
        <div>
            <table className="table">
                <thead>
                <tr className="border-b-base-100">
                    <th>File</th>
                    <th>Date</th>
                    <th>Flyers</th>
                    <th>Formations</th>
                    <th>View</th>
                </tr>
                </thead>
                <tbody>
                {videoData.map((data, idx) =>
                    data != null ? <tr key={idx} className="border-b-base-100">
                        <td>{data.fileName}</td>
                        <td>{formatDate(data.date)}</td>
                        <td>{data.flyers.join(',')}</td>
                        <td>{data.formationIds.join(',')}</td>
                        <td>{data.view}</td>
                    </tr> : null
                )}
                </tbody>
            </table>

            <form method="POST">
                <button className="btn" type="submit">Import</button>
            </form>
        </div>
    );
}
