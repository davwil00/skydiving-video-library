import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { getFlight } from "~/models/flights.server";
import { useRef, useState } from "react";
import { FlightFormation } from "@prisma/client";
import { format } from "date-fns";

export async function loader({ request }: LoaderFunctionArgs) {
  const searchParams = new URL(request.url).searchParams;
  const flight1Id = searchParams.get("flight1Id");
  const flight2Id = searchParams.get("flight2Id");

  invariant(flight1Id, "Missing flight1 id");
  invariant(flight2Id, "Missing flight2 id");

  const flight1 = await getFlight(flight1Id);
  const flight2 = await getFlight(flight2Id);

  invariant(flight1, "Unable to find flight1");
  invariant(flight2, "Unable to find flight2");

  return json({ flight1, flight2 });
}

export default function CompareFlights() {
  const { flight1, flight2 } = useLoaderData<typeof loader>();
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const [video1Ready, setVideo1Ready] = useState(false);
  const [video2Ready, setVideo2Ready] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    Promise.all([
      video1Ref.current?.paused ? video1Ref.current.play() : video1Ref.current?.pause(),
      video2Ref.current?.paused ? video2Ref.current.play() : video2Ref.current?.pause()
    ]).then(() => setIsPlaying(prev => !prev));
  };

  const formationsToString = (formations: Array<FlightFormation>) => formations.map(formation => formation.formationId).join(" ");

  return (
    <div className="flex align-center">
      <div>
        <h2>Flight 1: {format(flight1.session.date, "dd-MM-yyyy")} {formationsToString(flight1.formations)}</h2>
        <video ref={video1Ref} controls muted={true} preload="auto" className="h-[40dvh]"
               onCanPlayThrough={() => setVideo1Ready(true)}>
          <source src={`${flight1.videoUrl}`} />
        </video>
        <h2>Flight 2 {format(flight1.session.date, "dd-MM-yyyy")} {formationsToString(flight1.formations)}</h2>
        <video ref={video2Ref} controls muted={true} preload="auto" className="h-[40dvh]"
               onCanPlayThrough={() => setVideo2Ready(true)}>
          <source src={`${flight2.videoUrl}`} />
        </video>
      </div>
      <div className="content-center">
        <button className="btn m-4" onClick={togglePlay}>
          {video1Ready && video2Ready ? isPlaying ? 'Pause' : "Play" : (<span className="loading loading-spinner">Loading</span>)}
        </button>
      </div>
    </div>
  );
}
