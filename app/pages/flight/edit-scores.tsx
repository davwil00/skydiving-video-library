import { data, redirect } from 'react-router';
import invariant from 'tiny-invariant';
import { updateFlightScores } from '~/models/flights.server';
import { isLocalRequest } from '~/utils/localGuardUtils';
import type { ScoreCreateManyFlightInput } from '../../../prisma/generated/models/Score';
import type { Route } from './+types/edit-scores';

function extractScores(formData: FormData): ScoreCreateManyFlightInput[] {
    return Array.from(formData.entries())
        .filter(([entry]) => entry.startsWith('score'))
        .flatMap(([entry, value]) => {
            const details = entry.split('-');
            if (details.length !== 3 || value === '') {
                return [];
            }
            const [, idx, formationId] = details;
            return [
                {
                    formation: formationId,
                    score: parseInt(value as string, 10),
                    reason:
                        (formData.get(
                            `reason-${idx}-${formationId}`,
                        ) as string) ?? undefined,
                    order: parseInt(idx, 10),
                },
            ];
        });
}

export const action = async ({ request, params }: Route.ActionArgs) => {
    if (request.method !== 'POST') {
        return data({ message: 'Method not allowed', status: 405 });
    }
    if (!isLocalRequest(request)) {
        throw new Response('Forbidden', { status: 403 });
    }

    const flightId = params.flightId;
    invariant(flightId, 'flight not found');
    const formData = await request.formData();
    const scores = extractScores(formData);

    await updateFlightScores(flightId, scores);
    return redirect(`/flight/${flightId}`);
};
