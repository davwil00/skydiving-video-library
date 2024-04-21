import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/router";
import { isLocalRequest } from "~/utils/localGuardUtils";
import { json, redirect } from "@remix-run/node";
import { getFlight, updateFlight } from "~/models/flights.server";
import invariant from "tiny-invariant";
import { useLoaderData } from "@remix-run/react";
import { useReducer } from "react";
import { editFlightReducer, type EditFlightState } from "~/state/edit-flight-reducer";
import { format } from "date-fns";
import { readTag, writeTag } from "~/utils/tagUtils";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  if (!isLocalRequest(request)) {
    throw new Response("Forbidden", { status: 403 });
  }

  invariant(params.flightId, "flight not found");
  const flight = await getFlight(params.flightId);
  return json({ ...flight });
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  if (request.method !== "POST") {
    return json({ message: "Method not allowed" }, 405)
  }

  const flightId = params.flightId
  invariant(flightId, "flight not found");
  const formData = await request.formData()
  const fileName = formData.get('filename') as string
  const formationsTag = formData.get("formations") as string;
  const flyersTag = formData.get("flyers") as string;
  const formationIds = formationsTag?.split(',')
  const flyers = flyersTag.split('/')
  // const originalData = readTag(fileName)
  // await writeTag(fileName, {
  //   ...originalData,
  //   title: formationsTag,
  //   artist: flyersTag
  // })

  await updateFlight(flightId, formationIds, flyers)
  return redirect(`/flight/${flightId}`)
};

export default function EditFlight() {
  const flight = useLoaderData<typeof loader>();
  const initialState: EditFlightState = {
    flyers: flight.flyers?.map(flyer => flyer.name).join("/") || "",
    formations: flight.formations?.map(formation => formation.formationId).join(",") || "",
    date: format(new Date(flight.session?.date || ""), "dd/MM/yyyy")
  };

  const [state, dispatch] = useReducer(editFlightReducer, initialState);
  return (
    <form method="post" action={`/flight/${flight.id}/edit`}>
      <input type="hidden" value={flight.videoUrl} name="filename"/>
      <div className="flex justify-between items-start">
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Formations</span>
            </div>
            <input type="text" className="input input-bordered" name="formations" value={state.formations}
                   onChange={(event) => dispatch({
                     type: "formElementChange",
                     field: "formations",
                     value: event.currentTarget.value
                   })} />
          </label>

          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Flyers</span>
            </div>
            <input type="text" className="input input-bordered" name="flyers" value={state.flyers}
                   onChange={(event) => dispatch({
                     type: "formElementChange",
                     field: "flyers",
                     value: event.currentTarget.value
                   })} />
          </label>
        </div>
        <figure>
          <video controls width="480" muted={true} preload="none">
            <source src={`${flight.videoUrl}`} />
          </video>
        </figure>
      </div>

      <button className="btn btm-primary mt-3" type="submit">Submit</button>
    </form>
  );
}
