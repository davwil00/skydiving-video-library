import { json, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { trim } from "~/utils/ffmpegUtils";
import { isLocalRequest } from "~/utils/localGuardUtils";
import { useActionData } from "@remix-run/react";
import { type Buffer } from 'node:buffer'
import { ActionFunctionArgs } from '@remix-run/router'

export const action = async ({ request, params }: ActionFunctionArgs) => {
  if (request.method !== "POST") {
    return json({ message: "Method not allowed" }, 405);
  }
  if (!isLocalRequest(request)) {
    throw new Response("Forbidden", { status: 403 });
  }

  const flightId = params.flightId;
  invariant(flightId, "flight id is required");

  const formData = await request.formData();
  const fileName = `${formData.get("filename")?.toString()}`;
  const startTime = formData.get("startTime")?.toString();
  const endTime = formData.get("endTime")?.toString();
  if (fileName && (startTime || endTime)) {
    try {
      await trim(fileName, startTime, endTime);
      return redirect(`/flight/${flightId}`);
    } catch (error) {
      return json({ error: (error as Buffer[]).map(line => line.toString('utf8')) });
    }
  } else {
    return redirect(`/flight/${flightId}`);
  }
};

export default function TrimFlight() {
  const data = useActionData<{ error: string[] }>();
  if (data) {
    return (
      <>
        {data.error.map((line, index) =>
          <code key={index} className="block mt-4 text-red">{line}</code>
        )}
      </>
    );
  }

  return null;
}
