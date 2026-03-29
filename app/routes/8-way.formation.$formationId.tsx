import invariant from 'tiny-invariant';
import { useLoaderData } from 'react-router';
import { EIGHT_WAY_FORMATIONS, getDisplayName } from '~/data/formations';
import { isLocalRequest } from '~/utils/localGuardUtils';
import type { Route } from './+types/formation.$formationId';
import FormationImage from '~/components/formations/formation-images'
import { useState } from 'react'

export const loader = async ({params, request}: Route.LoaderArgs) => {
    invariant(params.formationId, 'formation not found');
    const isLocal = isLocalRequest(request);
    const formation = EIGHT_WAY_FORMATIONS[params.formationId];

    return {formation, isLocal};
};

export default function EightWayFormation() {
    const {formation} = useLoaderData<typeof loader>();
    const [martinColours, setMartinColours] = useState<boolean>(false);

    return (
        <div className={`relative ${martinColours ? 'martin' : ''}`}>
            <div className="flex gap-4 items-center">
                <h1 className="text-2xl">
                {formation.id} - {getDisplayName(formation)}
                </h1>
                <button type="button" className="btn btn-neutral" onClick={() => setMartinColours(prev => !prev)}>Toggle colours</button>
            </div>
            <div>
                <FormationImage formation={formation} className="h-[414px]" />
            </div>
        </div>
    )
}
