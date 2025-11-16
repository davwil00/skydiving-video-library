import { isLocalRequest } from '~/utils/localGuardUtils';
import { data, redirect, useLoaderData } from 'react-router';
import { getFlight, updateFlight } from '~/models/flights.server';
import invariant from 'tiny-invariant';
import { useReducer } from 'react';
import { editFlightReducer, type EditFlightState } from '~/state/edit-flight-reducer';
import { format } from 'date-fns';
import { readTag, writeTag } from '~/utils/tagUtils';
import type { Route } from './+types/flight.$flightId._index';
import { isRandomFormation, calculateScoresPerRound } from '~/utils/utils'

export const loader = async ({request, params}: Route.LoaderArgs) => {
    if (!isLocalRequest(request)) {
        throw new Response('Forbidden', {status: 403});
    }

    invariant(params.flightId, 'flight not found');
    const flight = await getFlight(params.flightId);
    invariant(flight, 'flight not found');
    return {...flight};
};

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
    const sideVideoUrl = formData.get('sideVideoUrl')
    const sideFileName = sideVideoUrl ? `./public${sideVideoUrl}` : null;
    const topVideoUrl = formData.get('topVideoUrl')
    const topFileName = topVideoUrl ? `./public${topVideoUrl}` : null;
    const formationsTag = formData.get('formations') as string;
    const flyersTag = formData.get('flyers') as string;
    const formationIds = formationsTag?.split(',');
    const flyers = flyersTag.split('/');

    if (sideFileName) {
        const originalData = await readTag(sideFileName).catch();
        await writeTag(sideFileName, {
            ...originalData,
            title: formationsTag,
            artist: flyersTag
        }).catch();
    }
    if (topFileName) {
        const originalData = await readTag(topFileName).catch();
        await writeTag(topFileName, {
            ...originalData,
            title: formationsTag,
            artist: flyersTag
        }).catch();
    }

    await updateFlight(flightId, formationIds, flyers);
    return redirect(`/flight/${flightId}`);
};

export default function EditFlight() {
    const flight = useLoaderData<typeof loader>();
    const scoresPerRound = calculateScoresPerRound(flight.formations.map(formation => formation.formationId))
    const initialState: EditFlightState = {
        flyers: flight.flyers?.map(flyer => flyer.name).join('/') || '',
        formations: flight.formations?.map(formation => formation.formationId).join(',') || '',
        date: format(new Date(flight.session?.date || ''), 'dd/MM/yyyy'),
        rounds: flight.scores.length / scoresPerRound || 0,
        scores: flight.scores.map(score => score.score)
    };

    function scoreIcon(key: string, id: string, formationId: string, scoreIdx: number) {
        const score = state.scores[scoreIdx] ?? '';
        let icon
        let nextValue
        switch (score) {
            case 0:
                icon = '🔴';
                nextValue = null;
                break;
            case 1:
                icon = '🟢';
                nextValue = 0;
                break;
            default:
                icon = '⚪';
                nextValue = 1
                break;
        }
        return (
            <td key={key} className="border-black border-1">
                <button type="button" className="btn btn-xs btn-outline"
                        onClick={() => dispatch({type: 'setScore', idx: scoreIdx, score: nextValue})}
                >
                    {icon}
                </button>
                {icon ? <input type="hidden" id={`score-${id}`} name={`score-${formationId}`} value={score}/> : null}
            </td>
        )
    }

    function makeRounds() {
        const roundElts = []
        let scoreIdx = 0;
        for (let round = 0; round < state.rounds; round ++) {
            roundElts.push(
                <tr key={`round-${round}`}>
                    <td className="border-black border-1">{round + 1}</td>
                    {flight.formations.map((formation, formationIdx) => {
                        const id = (round * flight.formations.length) + formationIdx;
                        if (isRandomFormation(formation.formationId)) {
                            scoreIdx += 1;
                            return (
                               scoreIcon(`formation-${formationIdx}-round-${round}`, `${id}`, formation.formationId, scoreIdx - 1)
                            )
                        }
                        scoreIdx += 2;
                        return (
                            <>
                                {scoreIcon(`formation-${formationIdx}-round-${round}-A`, `${id}-A`, formation.formationId, scoreIdx - 2)}
                                {scoreIcon(`formation-${formationIdx}-round-${round}-B`, `${id}-B`, formation.formationId, scoreIdx - 1)}
                            </>
                        )
                    })}
                    <td className="border-black border-1">
                        {round + 1 === state.rounds ? <button type="button" className="btn btn-sm btn-outline" onClick={() => dispatch({type: 'removeLastRound'})}>x</button> : null}
                    </td>
                </tr>
            )
        }
        return roundElts
    }

    const [state, dispatch] = useReducer(editFlightReducer, initialState);
    return (
        <div className="flex justify-between items-start form-light gap-4">
            <div>
                <form method="post" className="flex flex-col">
                    <h2 className="text-2xl">Edit Metadata</h2>
                    <input type="hidden" value={flight.sideVideoUrl || ""} name="sideVideoUrl"/>
                    <input type="hidden" value={flight.topVideoUrl || ""} name="topVideoUrl"/>
                    <label className="">
                        <div className="label-text">Formations</div>
                        <input type="text"
                               className="input input-bordered"
                               placeholder="Formations"
                               name="formations"
                               value={state.formations}
                               onChange={(event) => dispatch({
                                   type: 'formElementChange',
                                   field: 'formations',
                                   value: event.currentTarget.value
                               })}/>
                    </label>

                    <label className="">
                        <div className="label-text">Flyers</div>
                        <input type="text"
                               className="input input-bordered"
                               name="flyers" value={state.flyers}
                               onChange={(event) => dispatch({
                                   type: 'formElementChange',
                                   field: 'flyers',
                                   value: event.currentTarget.value
                               })}/>
                    </label>

                    <button className="btn btm-primary mt-3" type="submit">Submit</button>
                </form>

                <form method="post" action={`/flight/${flight.id}/edit-scores`} className="flex flex-col mt-8">
                    <div className="label-text">Scores</div>
                    <table className="table table-auto border-1 border-black">
                        <thead>
                        <tr className="border-black">
                            <th className="border-black">Round</th>
                            {flight.formations.map((formation, idx) => (
                                isRandomFormation(formation.formationId) ?
                                        <th key={`formation-${idx}`} className="border-black border-1">{formation.formationId}</th>
                                        : <>
                                            <th className="border-black border-1">{formation.formationId}</th>
                                            <th className="border-black border-1">{formation.formationId}</th>
                                        </>
                                )
                            )}
                        </tr>
                        </thead>
                        <tbody>
                        {makeRounds()}
                        </tbody>
                    </table>
                    <button type="button" className="btn btn-outline mt-2" onClick={() => dispatch({type: 'addRound', scoresPerRound})}>Add Round</button>
                    <button className="btn btm-primary mt-3" type="submit">Submit</button>
                </form>

                <form method="post" action={`/flight/${flight.id}/trim`} className="mt-8 flex flex-col">
                    <h2 className="text-2xl">Trim</h2>
                    <input type="hidden" value={flight.sideVideoUrl || ""} name="sideVideoUrl"/>
                    <input type="hidden" value={flight.topVideoUrl || ""} name="topVideoUrl"/>
                    <label className="">
                        <div className="label-text">
                            <span className="label-text">Start time</span>
                        </div>
                        <input type="text" className="input input-bordered" name="startTime"
                               pattern="^(?:\d+|\d+:\d{2})$"/>
                    </label>
                    <label className="">
                        <div className="label-text">
                            <span className="label-text">End time</span>
                        </div>
                        <input type="text" className="input input-bordered" name="endTime"
                               pattern="^(?:\d+|\d+:\d{2})$"/>
                    </label>
                    <div className="join mt-4">
                        <input className="join-item btn" type="radio" name="target" value="SIDE" aria-label="Side" />
                        <input className="join-item btn" type="radio" name="target" value="TOP" aria-label="Top" />
                        <input className="join-item btn" type="radio" name="target" value="BOTH" aria-label="Both" />
                    </div>
                    <button type="submit" className="btn mt-4">Trim</button>
                </form>
            </div>
            <div>
                <figure className="mb-4">
                    <h3>Side</h3>
                    <video controls width="480" muted={true} preload="none">
                        <source src={`${flight.sideVideoUrl}`}/>
                    </video>
                </figure>
                <figure>
                    <h3>Top</h3>
                    <video controls width="480" muted={true} preload="none">
                        <source src={`${flight.topVideoUrl}`}/>
                    </video>
                </figure>
            </div>
        </div>
    );
}
