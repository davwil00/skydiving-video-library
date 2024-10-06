import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { findFlightsWithFormations } from "~/models/flights.server";
import invariant from "tiny-invariant";
import FlightCard from "~/components/flight-card";
import { LoaderFunctionArgs } from "@remix-run/router";

export async function loader({ request }: LoaderFunctionArgs) {
  const searchParams = new URL(request.url).searchParams;
  const query = searchParams.get("query");
  invariant(query, "Please specify a search query");
  let formationIds;
  if (query.includes(",")) {
    formationIds = query.split(",");
  } else {
    formationIds = query.split("");
  }

  const results = await findFlightsWithFormations(formationIds);
  return json({ results, formationIds });
}

export default function Search() {
  const { results, formationIds } = useLoaderData<typeof loader>();
  if (results.length == 0) {
    return (<p>No flights found.</p>);
  }
  return (
    <>
      <h1 className="text-xl">Results for {formationIds.map(id => id.toUpperCase()).join(",")}</h1>
      <div className="flex flex-wrap justify-center">
        {results.map((flight, idx) =>
          <FlightCard flight={flight} session={flight.session} showDate={true} showView={true} key={idx} />
        )}
      </div>
    </>
  );
}