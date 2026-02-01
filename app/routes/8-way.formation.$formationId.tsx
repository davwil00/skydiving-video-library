import invariant from 'tiny-invariant';
import { useLoaderData } from 'react-router';
import { getFormationImageUrl } from '~/utils/utils';
import { EIGHT_WAY_FORMATIONS, getDisplayName } from '~/data/formations';
import { isLocalRequest } from '~/utils/localGuardUtils';
import type { Route } from './+types/formation.$formationId';

export const loader = async ({params, request}: Route.LoaderArgs) => {
    invariant(params.formationId, 'formation not found');
    const isLocal = isLocalRequest(request);
    const formation = EIGHT_WAY_FORMATIONS[params.formationId];

    return {formation, isLocal};
};

export default function EightWayFormation() {
    const {formation} = useLoaderData<typeof loader>();

    return (
        <div className="relative">
            <h1 className="text-2xl">
                {formation.id} - {getDisplayName(formation)}
            </h1>
            <div>
                <img src={getFormationImageUrl(formation)}
                     alt={`${formation.id}`}
                     className="h-fit max-h-[80vh] mx-auto mt-2"
                />
            </div>
        </div>
    )
}
