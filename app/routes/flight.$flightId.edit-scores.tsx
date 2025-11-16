import { isLocalRequest } from '~/utils/localGuardUtils';
import { data, redirect } from 'react-router';
import { Score, updateFlightScores } from '~/models/flights.server';
import invariant from 'tiny-invariant';
import type { Route } from './+types/flight.$flightId._index';

function extractScores(formData: FormData): Score[] {
    return Array.from(formData.entries())
        .filter(([entry]) => entry.startsWith('score'))
        .flatMap(([entry, value], idx) => {
            const formation = entry.replace('score-', '');
            if (value === '') {
                return []
            }
            return [{
                formation: formation,
                score: parseInt(value as string),
                order: idx
            }]
        })
}

export const action = async ({request, params}: Route.ActionArgs) => {
    if (request.method !== 'POST') {
        return data({message: 'Method not allowed', status: 405});
    }
    if (!isLocalRequest(request)) {
        throw new Response('Forbidden', {status: 403});
    }

    const flightId = params.flightId;
    invariant(flightId, 'flight not found');
    const formData = await request.formData();
    const scores = extractScores(formData)

    await updateFlightScores(flightId, scores);
    return redirect(`/flight/${flightId}`);
};
