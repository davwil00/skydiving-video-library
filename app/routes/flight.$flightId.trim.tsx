import { data, redirect, useActionData } from 'react-router';
import invariant from 'tiny-invariant';
import { trim } from '~/utils/ffmpegUtils';
import { isLocalRequest } from '~/utils/localGuardUtils';
import { type Buffer } from 'node:buffer'
import type { Route } from './+types/flight.$flightId.trim';

export const action = async ({request, params}: Route.ActionArgs) => {
    if (request.method !== 'POST') {
        return data({message: 'Method not allowed', status: 405});
    }
    if (!isLocalRequest(request)) {
        throw new Response('Forbidden', {status: 403});
    }

    const flightId = params.flightId;
    invariant(flightId, 'flight id is required');

    const formData = await request.formData();
    const fileNames = []
    const target = formData.get('target')
    if (target === 'BOTH' || target === 'SIDE') {
        fileNames.push(formData.get('sideVideoUrl')?.toString());
    }
    if (target === 'BOTH' || target === 'TOP') {
        fileNames.push(formData.get('topVideoUrl')?.toString());
    }
    const startTime = formData.get('startTime')?.toString();
    const endTime = formData.get('endTime')?.toString();
    try {
        for (const fileName of fileNames) {
            if (fileName && (startTime || endTime)) {
                await trim(`./public/${fileName}`, startTime, endTime);
            }
        }
    } catch (error) {
        return {error: (error as Buffer[]).map(line => line.toString('utf8'))};
    }
    return redirect(`/flight/${flightId}`);
}

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
