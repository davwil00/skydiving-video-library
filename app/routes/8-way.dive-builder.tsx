import { useLoaderData } from 'react-router';
import { get8WayFormationImageUrl } from '~/utils/utils';
import { EIGHT_WAY_FORMATIONS, getDisplayName } from '~/data/formations';
import type { Route } from './+types/formation.$formationId';

export const loader = async ({request}: Route.LoaderArgs) => {
    const url = new URL(request.url);
    const diveParam = url.searchParams.get('dive');
    const formations = diveParam ? diveParam.split(',').map(id => EIGHT_WAY_FORMATIONS[id.toUpperCase()]) : [];

    return {formations};
};

export default function EightWayFormation() {
    const {formations} = useLoaderData<typeof loader>();

    if (formations.length === 0) {
        return (
            <div>
                <form>
                    <label className="input input-bordered flex items-center gap-2 join-item w-[75%] bg-white">
                        <input name="dive" placeholder="comma separated list of formations e.g. '1,A'"/>
                    </label>
                    <button type="submit" className="btn btn-neutral">Generate</button>
                </form>
            </div>
        )
    }

    return (
        <div className="relative">
            <h1 className="text-2xl">
                {formations.map(formation => `${formation.id} - ${getDisplayName(formation)}`)}
            </h1>
            <img src="/images/8-way/starting-1.png"
                 alt="Starting Position 1"
                 className="h-fit max-h-[80vh] mx-auto mt-2"
            />
            {formations.map((formation, idx) =>
                <div key={idx}>
                    <img src={get8WayFormationImageUrl(formation)}
                         alt={`${formation.id}`}
                         className="h-fit max-h-[80vh] mx-auto mt-2"
                    />
                </div>
            )}
            Key:
            <ul>
                <li>Point - White</li>
                <li>Outside Front - Grey</li>
                <li>Inside Front - Purple</li>
                <li>Outside Center - Red</li>
                <li>Inside Center - Blue</li>
                <li>Outside Rear - Orange</li>
                <li>Inside Rear - Green</li>
                <li>Tail - Yellow</li>
            </ul>
        </div>
    )
}
