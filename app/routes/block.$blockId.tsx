import { json, type LoaderArgs } from "@remix-run/node";
import invariant from "tiny-invariant";
import { useLoaderData } from "@remix-run/react";
import FlightCard from "~/components/flight-card";
import { getByBlockId } from "~/models/flights.server";
import { getBlockImageUrl } from "~/utils";
import { getBlock } from "~/models/blocks.server";

export const loader = async ({ params, request }: LoaderArgs) => {
  invariant(params.blockId, "block not found");

  const blockId = parseInt(params.blockId);
  const flights = await getByBlockId(blockId);
  const block = await getBlock(blockId);
  if (!flights || !block) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({ flights, block });
};

export default function SessionDetailsPage() {
  const { flights, block } = useLoaderData<typeof loader>();

  return (
    <div>
      <h1 className="text-2xl">
        {block.id} - {block.startFormation} &rarr; {block.endFormation}
      </h1>
      <div>
        <div className="sm:w-full md:w-1/3 inline-block max-w-screen-xl">
          <div className="card card-compact m-4">
            <figure>
              <img src={getBlockImageUrl(block.id)}
                   alt={`${block.id}`}
                   className="h-fit"
              />
            </figure>
          </div>
        </div>
        <div className="sm:w-1/2 md:w-full inline-block align-top">
          {flights.map((flight, idx) => (
            <FlightCard
              key={idx}
              flight={flight}
              session={flight.session}
              showDate={true}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
