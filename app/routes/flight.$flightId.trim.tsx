import { type ActionArgs, json, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { trim } from "~/utils/ffmpegUtils";
import { isLocalRequest } from "~/utils/localGuardUtils";

export const action = async({request, params}: ActionArgs) => {
  if (request.method !== 'POST') {
    return json({message: "Method not allowed"}, 405)
  }
  if (!isLocalRequest(request)) {
    throw new Response("Forbidden", { status: 403 });
  }

  const flightId = params.flightId
  invariant(flightId, 'flight id is required')

  const formData = await request.formData()
  const fileName = `${formData.get('filename')?.toString()}`
  const startTime = parseInt(formData.get('startTime')?.toString() || "")
  const endTime = parseInt(formData.get('endTime')?.toString() || "")
  if (fileName && (startTime || endTime)) {
    return trim(fileName, startTime, endTime)
      .then(() => redirect(`/flight/${flightId}`))
      .catch((error) => json({ error }))
  } else {
    return redirect(`/flight/${flightId}`)
  }
}
