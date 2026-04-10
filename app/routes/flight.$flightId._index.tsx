import { useLoaderData } from 'react-router';
import invariant from 'tiny-invariant';
import FlightCard from '~/components/flight-card';
import { getFlight } from '~/models/flights.server';
import { isLocalRequest } from '~/utils/localGuardUtils';
import type { Route } from './+types/flight.$flightId._index';

export const loader = async ({ request, params }: Route.LoaderArgs) => {
    invariant(params.flightId, 'flight not found');
    const isLocal = isLocalRequest(request);
    const flight = await getFlight(params.flightId);
    invariant(flight, 'flight not found');
    return { flight, isLocal };
};

export default function EditFlight() {
    const { flight, isLocal } = useLoaderData<typeof loader>();

    return (
        <FlightCard
            flight={flight}
            session={flight.session}
            showDate={true}
            isLocal={isLocal}
        />
    );
}
