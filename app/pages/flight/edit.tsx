import { format } from 'date-fns';
import { Fragment, useReducer } from 'react';
import { data, redirect, useLoaderData } from 'react-router';
import invariant from 'tiny-invariant';
import ScoreInput from '~/components/score-input';
import { getFlight, updateFlight } from '~/models/flights.server';
import {
    type EditFlightState,
    editFlightReducer,
    type Score,
} from '~/state/edit-flight-reducer';
import { isLocalRequest } from '~/utils/localGuardUtils';
import { readTag, writeTag } from '~/utils/tagUtils';
import { calculateScoresPerRound, isRandomFormation } from '~/utils/utils';
import type { Route } from './+types/edit';

export const loader = async ({ request, params }: Route.LoaderArgs) => {
    if (!isLocalRequest(request)) {
        throw new Response('Forbidden', { status: 403 });
    }

    invariant(params.flightId, 'flight not found');
    const flight = await getFlight(params.flightId);
    invariant(flight, 'flight not found');
    return { ...flight };
};

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
    const sideVideoUrl = formData.get('sideVideoUrl');
    const sideFileName = sideVideoUrl ? `./public${sideVideoUrl}` : null;
    const topVideoUrl = formData.get('topVideoUrl');
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
            artist: flyersTag,
        }).catch();
    }
    if (topFileName) {
        const originalData = await readTag(topFileName).catch();
        await writeTag(topFileName, {
            ...originalData,
            title: formationsTag,
            artist: flyersTag,
        }).catch();
    }

    await updateFlight(flightId, formationIds, flyers);
    return redirect(`/flight/${flightId}`);
};

export default function EditFlight() {
    const flight = useLoaderData<typeof loader>();
    const scoresPerRound = calculateScoresPerRound(
        flight.formations.map((formation) => formation.formationId),
    );
    const initialState: EditFlightState = {
        flyers: flight.flyers?.map((flyer) => flyer.name).join('/') || '',
        formationIds: flight.formations.map(
            (formation) => formation.formationId,
        ),
        date: format(new Date(flight.session?.date || ''), 'dd/MM/yyyy'),
        scores: flight.scores.reduce((scores, score, idx) => {
            if (idx % scoresPerRound === 0) {
                scores.push([]);
            }
            const round = Math.floor(idx / scoresPerRound);
            scores[round].push({
                formationId: score.formation,
                score: score.score,
                reason: score.reason,
            });
            return scores;
        }, [] as Score[][]),
    };

    function makeRounds() {
        return state.scores.map((round, roundIdx) => (
            <tr>
                <td className="border-black border">{roundIdx + 1}</td>
                {round.map((score, scoreIdx) => {
                    const idx = roundIdx * round.length + scoreIdx;
                    return (
                        <ScoreInput
                            key={`formation-${score.formationId}-round-${roundIdx}`}
                            idx={`${idx}`}
                            roundIdx={roundIdx}
                            scoreIdx={scoreIdx}
                            score={score}
                            dispatch={dispatch}
                        />
                    );
                })}
                {roundIdx === state.scores.length - 1 ? (
                    <td className="border-black border border-t">
                        <button
                            type="button"
                            className="btn btn-sm"
                            onClick={() =>
                                dispatch({ type: 'removeLastRound' })
                            }
                        >
                            x
                        </button>
                    </td>
                ) : (
                    <td></td>
                )}
            </tr>
        ));
    }

    const [state, dispatch] = useReducer(editFlightReducer, initialState);
    return (
        <div className="flex justify-between items-start form-light gap-4">
            <div>
                <form method="post" className="flex flex-col">
                    <h2 className="text-2xl">Edit Metadata</h2>
                    <input
                        type="hidden"
                        value={flight.sideVideoUrl || ''}
                        name="sideVideoUrl"
                    />
                    <input
                        type="hidden"
                        value={flight.topVideoUrl || ''}
                        name="topVideoUrl"
                    />
                    <label className="">
                        <div className="label-text">Formations</div>
                        <input
                            type="text"
                            className="input input-bordered"
                            placeholder="Formations"
                            name="formations"
                            value={state.formationIds}
                            onChange={(event) =>
                                dispatch({
                                    type: 'formElementChange',
                                    field: 'formations',
                                    value: event.currentTarget.value,
                                })
                            }
                        />
                    </label>

                    <label className="">
                        <div className="label-text">Flyers</div>
                        <input
                            type="text"
                            className="input input-bordered"
                            name="flyers"
                            value={state.flyers}
                            onChange={(event) =>
                                dispatch({
                                    type: 'formElementChange',
                                    field: 'flyers',
                                    value: event.currentTarget.value,
                                })
                            }
                        />
                    </label>

                    <button className="btn btm-primary mt-3" type="submit">
                        Submit
                    </button>
                </form>

                <form
                    method="post"
                    action={`/flight/${flight.id}/edit-scores`}
                    className="flex flex-col mt-8"
                >
                    <div className="label-text">Scores</div>
                    <table className="table table-auto border-collapse">
                        <thead>
                            <tr className="border-black">
                                <th className="border-black border">Round</th>
                                {flight.formations.map((formation) =>
                                    isRandomFormation(formation.formationId) ? (
                                        <th
                                            key={`formation-${formation.formationId}`}
                                            className="border-black border"
                                        >
                                            {formation.formationId}
                                        </th>
                                    ) : (
                                        <Fragment
                                            key={`formation-${formation.formationId}`}
                                        >
                                            <th className="border-black border">
                                                {formation.formationId}
                                            </th>
                                            <th className="border-black border">
                                                {formation.formationId}
                                            </th>
                                        </Fragment>
                                    ),
                                )}
                                <th className=""></th>
                            </tr>
                        </thead>
                        <tbody>{makeRounds()}</tbody>
                    </table>
                    <button
                        type="button"
                        className="btn mt-2 black"
                        onClick={() =>
                            dispatch({ type: 'addRound', scoresPerRound })
                        }
                    >
                        Add Round
                    </button>
                    <button className="btn btm-primary mt-3" type="submit">
                        Submit
                    </button>
                </form>

                <form
                    method="post"
                    action={`/flight/${flight.id}/trim`}
                    className="mt-8 flex flex-col"
                >
                    <h2 className="text-2xl">Trim</h2>
                    <input
                        type="hidden"
                        value={flight.sideVideoUrl || ''}
                        name="sideVideoUrl"
                    />
                    <input
                        type="hidden"
                        value={flight.topVideoUrl || ''}
                        name="topVideoUrl"
                    />
                    <label className="">
                        <div className="label-text">
                            <span className="label-text">Start time</span>
                        </div>
                        <input
                            type="text"
                            className="input input-bordered"
                            name="startTime"
                            pattern="^(?:\d+|\d+:\d{2})$"
                        />
                    </label>
                    <label className="">
                        <div className="label-text">
                            <span className="label-text">End time</span>
                        </div>
                        <input
                            type="text"
                            className="input input-bordered"
                            name="endTime"
                            pattern="^(?:\d+|\d+:\d{2})$"
                        />
                    </label>
                    <div className="join mt-4">
                        <input
                            className="join-item btn"
                            type="radio"
                            name="target"
                            value="SIDE"
                            aria-label="Side"
                        />
                        <input
                            className="join-item btn"
                            type="radio"
                            name="target"
                            value="TOP"
                            aria-label="Top"
                        />
                        <input
                            className="join-item btn"
                            type="radio"
                            name="target"
                            value="BOTH"
                            aria-label="Both"
                        />
                    </div>
                    <button type="submit" className="btn mt-4">
                        Trim
                    </button>
                </form>
            </div>
            <div>
                <figure className="mb-4">
                    <h3>Side</h3>
                    <video controls width="480" muted={true} preload="none">
                        <source src={`${flight.sideVideoUrl}`} />
                    </video>
                </figure>
                <figure>
                    <h3>Top</h3>
                    <video controls width="480" muted={true} preload="none">
                        <source src={`${flight.topVideoUrl}`} />
                    </video>
                </figure>
            </div>
        </div>
    );
}
