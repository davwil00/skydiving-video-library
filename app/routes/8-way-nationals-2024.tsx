import FlightCard from "~/components/flight-card";
import { useLoaderData } from "react-router";
import {processFile} from "~/utils/tagUtils";
import {VIDEO_DATA_PATH} from "~/routes/sync-db";
import {readdir} from "node:fs/promises";

export const loader = async () => {
    const videoDataPath = `${VIDEO_DATA_PATH}/library/2024-11-08/8-way`
    const dir = await readdir(`${videoDataPath}`, {
        withFileTypes: true
    });
    const files = await Promise.all(dir
        .filter(file => file.name.endsWith(".mp4"))
        .map(async file => {
            // const tagData = await readTag(`${file.parentPath}/${file.name}`);
            const videoData = (await processFile(file, videoDataPath))!
            return {
                ...videoData,
                id: file.name,
                topVideoUrl: `/video-data/library/2024-11-08/8-way/${file.name}`,
                sideVideoUrl: null,
                flyers: videoData.flyers.map(name => ({name})),
                formations: videoData.formationIds.map(formationId => ({formationId})),
            };
        })
    );
    return {files};
};


export default function EightWay() {
    const {files} = useLoaderData<typeof loader>()
    return (
        <div>
            <h1 className="text-2xl text-black">
                8 Way (Nationals 2024) 🥈
            </h1>
            <div className="flex flex-wrap justify-center">
                {files.map((flight, idx) => (
                        <FlightCard
                            key={idx}
                            flight={flight}
                            session={{date: new Date('2024-11-08')}}
                            showDate={false}
                            isLocal={false}
                        />
                    ))}
            </div>
        </div>
    );
}
