import invariant from 'tiny-invariant'
import { getCompetition, updateCompetition } from '~/models/competitions.server'
import { Route } from '../../.react-router/types/app/routes/+types/competition.$competitionId.edit'
import { data, redirect, useLoaderData } from 'react-router'
import { formatDate } from '~/utils/utils'
import { getAllSessionDates } from '~/models/sessions.server'
import { format } from 'date-fns'
import { useReducer, useRef } from 'react'
import { isLocalRequest } from '~/utils/localGuardUtils'
import { competitionReducer } from '~/state/competition-reducer'

export async function loader({params}: Route.LoaderArgs) {
    const competition = await getCompetition(params.competitionId);
    invariant(competition, 'Competition not found');
    const sessions = await getAllSessionDates()
    return {competition, sessions};
}

export const action = async ({request, params}: Route.ActionArgs) => {
    if (request.method !== 'POST' || !isLocalRequest(request)) {
        return data({message: 'Method not allowed'})
    }

    const formData = await request.formData();
    const sessionIds = formData.getAll('linkedSession').map(sessionId => sessionId as string)
    const rank = formData.get("rank") as string | null

    const competitionData = {
        startDate: new Date(formData.get('startDate') as string),
        endDate: new Date(formData.get('endDate') as string),
        name: formData.get('name') as string,
        location: formData.get('location') as string,
        rank: rank ? parseInt(rank) : null,
        sessionIds: sessionIds
    };

    await updateCompetition(params.competitionId, competitionData);

    return redirect(`/competition/${params.competitionId}`);
}

export default function Competition() {
    const {competition, sessions} = useLoaderData<typeof loader>();
    const sessionPicker = useRef<HTMLSelectElement>(null)
    const [state, dispatch] = useReducer(competitionReducer, {
        startDate: format(competition.startDate, 'yyyy-MM-dd'),
        endDate: format(competition.endDate, 'yyyy-MM-dd'),
        name: competition.name,
        location: competition.location,
        rank: competition.rank,
        sessions: new Set(competition.sessions)
    });

    return (
        <div>
            <h1 className="text-2xl">Edit Competition</h1>
            <form method="post" className="form-light flex flex-col">
                <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text">Start Date</span>
                    </div>
                    <input type="date" className="input input-bordered" name="startDate"
                           value={state.startDate}
                           onChange={(e) => dispatch({
                               type: 'formElementChange',
                               field: 'startDate',
                               value: e.currentTarget.value
                           })}
                    />
                </label>
                <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text">End Date</span>
                    </div>
                    <input type="date" className="input input-bordered" name="endDate"
                           value={state.endDate}
                           onChange={(e) => dispatch({
                               type: 'formElementChange',
                               field: 'endDate',
                               value: e.currentTarget.value
                           })}
                    />
                </label>
                <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text">Name</span>
                    </div>
                    <input type="text" className="input input-bordered" name="name" value={state.name}
                           onChange={(e) => dispatch({
                               type: 'formElementChange',
                               field: 'name',
                               value: e.currentTarget.value
                           })}
                    />
                </label>
                <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text">Location</span>
                    </div>
                    <input type="text" className="input input-bordered" name="location" value={state.location}
                           onChange={(e) => dispatch({
                               type: 'formElementChange',
                               field: 'location',
                               value: e.currentTarget.value
                           })}
                    />
                </label>
                <div className="my-2">
                    <span className="label-text">Sessions</span>
                    <ul className="list">
                        {
                            Array.from(state.sessions).map((linkedSession, idx) => (
                                <li key={`linkedSession${idx}`} className="list-row items-center">
                                    <input type="hidden" name={`linkedSession`} value={linkedSession.id}/>
                                    <div>{formatDate(linkedSession.date)}</div>
                                    <button className="btn btn-square btn-xs btn-outline"
                                            onClick={() => dispatch({
                                                type: 'removeSession',
                                                session: linkedSession
                                            })}
                                    >
                                        x
                                    </button>
                                </li>
                            ))
                        }
                    </ul>
                </div>
                <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text">Add Session</span>
                    </div>

                    <div className="join flex">
                        <select className="select join-item" ref={sessionPicker}>
                            {sessions.map((session) => (
                                <option key={session.id} value={session.id}>{formatDate(session.date)}</option>
                            ))}
                        </select>
                        <button type="button" className="btn btn-outline join-item" onClick={() => dispatch({
                            type: 'addSession',
                            session: sessions.find(session => session.id === sessionPicker.current?.value)!
                        })}>+
                        </button>
                    </div>
                </label>
                <button type="submit" className="btn mt-4 max-w-xs">Update</button>
            </form>
        </div>
    );
}