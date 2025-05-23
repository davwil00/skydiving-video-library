import { isLocalRequest } from "~/utils/localGuardUtils";
import { data, redirect, useLoaderData } from "react-router";
import { getFlight, updateFlight } from "~/models/flights.server";
import invariant from "tiny-invariant";
import { useReducer } from "react";
import { editFlightReducer, type EditFlightState } from "~/state/edit-flight-reducer";
import { format } from "date-fns";
import { readTag, writeTag } from "~/utils/tagUtils";
import type { Route } from "./+types/flight.$flightId._index";

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  if (!isLocalRequest(request)) {
    throw new Response("Forbidden", { status: 403 });
  }

  invariant(params.flightId, "flight not found");
  const flight = await getFlight(params.flightId);
  return { ...flight };
};

export const action = async ({ request, params }: Route.ActionArgs) => {
  if (request.method !== "POST") {
    return data({ message: "Method not allowed", status: 405 });
  }
  if (!isLocalRequest(request)) {
    throw new Response("Forbidden", { status: 403 });
  }

  const flightId = params.flightId;
  invariant(flightId, "flight not found");
  const formData = await request.formData();
  const fileName = `./public${formData.get("filename")}`;
  const formationsTag = formData.get("formations") as string;
  const flyersTag = formData.get("flyers") as string;
  const formationIds = formationsTag?.split(",");
  const flyers = flyersTag.split("/");
  const originalData = readTag(fileName);
  await writeTag(fileName, {
    ...originalData,
    title: formationsTag,
    artist: flyersTag
  });

  await updateFlight(flightId, formationIds, flyers);
  return redirect(`/flight/${flightId}`);
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
    <div className="flex justify-between items-start form-light">
      <div>
        <form method="post" action={`/flight/${flight.id}/edit`}>
          <input type="hidden" value={flight.videoUrl} name="filename" />
          <label className="">
            <div className="label-text">Formations</div>
            <input type="text"
                   className="input input-bordered"
                   placeholder="Formations"
                   name="formations"
                   value={state.formations}
                   onChange={(event) => dispatch({
                     type: "formElementChange",
                     field: "formations",
                     value: event.currentTarget.value
                   })} />
          </label>

          <label className="">
            <div className="label-text">Flyers</div>
            <input type="text"
                   className="input input-bordered"
                   name="flyers" value={state.flyers}
                   onChange={(event) => dispatch({
                     type: "formElementChange",
                     field: "flyers",
                     value: event.currentTarget.value
                   })} />
          </label>

          <button className="btn btm-primary mt-3" type="submit">Submit</button>
        </form>

        <form method="post" action={`/flight/${flight.id}/trim`} className="mt-8">
          <input type="hidden" value={flight.videoUrl} name="filename" />
          <h2 className="text-2xl">Trim</h2>
          <label className="">
            <div className="label-text">
              <span className="label-text">Start time</span>
            </div>
            <input type="text" className="input input-bordered" name="startTime" pattern="^(?:\d+|\d+:\d{2})$" />
          </label>
          <label className="">
            <div className="label-text">
              <span className="label-text">End time</span>
            </div>
            <input type="text" className="input input-bordered" name="endTime" pattern="^(?:\d+|\d+:\d{2})$" />
          </label>
          <button type="submit" className="btn mt-4">Trim</button>
        </form>
      </div>
      <figure>
        <video controls width="480" muted={true} preload="none">
          <source src={`${flight.videoUrl}`} />
        </video>
      </figure>
    </div>
  );
}
