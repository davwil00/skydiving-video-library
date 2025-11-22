import { isLocalRequest } from '~/utils/localGuardUtils';
import { data, redirect, useLoaderData } from 'react-router';
import { createCompetition } from '~/models/competitions.server';
import { Route } from '../../.react-router/types/app/routes/+types/competition.add';
import { getAllNonCompetitionSessionDates } from '~/models/sessions.server';
import { formatDate } from '~/utils/utils';
import { useRef, useState } from 'react'
import { Session } from '@prisma/client'

type SessionIdAndDate = Pick<Session, 'id' | 'date'>
export const loader = async () => {
    const sessions = await getAllNonCompetitionSessionDates()
    sessions.reverse()
    return data({ sessions });
}

export const action = async ({ request }: Route.ActionArgs) => {
    if (request.method !== "POST" || !isLocalRequest(request)) {
        return data({ message: 'Method not allowed'})
    }

    const formData = await request.formData();
    const sessionIds = formData.getAll("linkedSession").map(sessionId => sessionId as string)
    const rank = formData.get("rank") as string | null

    const competitionData = {
        startDate: new Date(formData.get("startDate") as string),
        endDate: new Date(formData.get("endDate") as string),
        name: formData.get("name") as string,
        location: formData.get("location") as string,
        sessionIds: sessionIds,
        rank: rank ? parseInt(rank) : null,
    };

    const competition = await createCompetition(competitionData);

    return redirect(`/competition/${competition.id}`);
}

export default function AddCompetition() {
    const { sessions } = useLoaderData<typeof loader>();
    const [linkedSessions, setLinkedSessions] = useState<Set<SessionIdAndDate>>(new Set())
    const sessionPicker = useRef<HTMLSelectElement>(null)

    const addSession = () => {
        const selectedSession = sessions.find(session => session.id === sessionPicker.current?.value)
        if (selectedSession) {
            setLinkedSessions((prev) => new Set([...prev, selectedSession]))
        }
    }

    const removeSession = ((sessionToRemove: SessionIdAndDate) => {
        setLinkedSessions((prev) => {
            const newSet = new Set(prev)
            newSet.delete(sessionToRemove)
            return newSet
        })
    })

    return <div>
        <h1 className="text-2xl">Add Competition</h1>
        <form method="post" className="form-light flex flex-col">
            <label className="form-control w-full max-w-xs">
                <div className="label">
                    <span className="label-text">Start Date</span>
                </div>
                <input type="date" className="input input-bordered" name="startDate" />
            </label>
            <label className="form-control w-full max-w-xs">
                <div className="label">
                    <span className="label-text">End Date</span>
                </div>
                <input type="date" className="input input-bordered" name="endDate" />
            </label>
            <label className="form-control w-full max-w-xs">
                <div className="label">
                    <span className="label-text">Name</span>
                </div>
                <input type="text" className="input input-bordered" name="name" />
            </label>
            <label className="form-control w-full max-w-xs">
                <div className="label">
                    <span className="label-text">Location</span>
                </div>
                <input type="text" className="input input-bordered" name="location" />
            </label>
            <label className="form-control w-full max-w-xs">
                <div className="label">
                    <span className="label-text">Rank</span>
                </div>
                <input type="number" className="input input-bordered" name="rank" />
            </label>
            <div className="my-2">
                <span className="label-text">Sessions</span>
                <ul className="list">
                    {
                        Array.from(linkedSessions).map((linkedSession, idx) => (
                            <li key={`linkedSession${idx}`} className="list-row items-center">
                                <input type="hidden" name={`linkedSession`} value={linkedSession.id}/>
                                <div>{formatDate(linkedSession.date)}</div>
                                <button className="btn btn-square btn-xs btn-outline" onClick={() => removeSession(linkedSession)}>
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
                    <button type="button" className="btn btn-outline join-item" onClick={addSession}>+</button>
                </div>
            </label>
            <button type="submit" className="btn mt-4 max-w-xs" disabled={linkedSessions.size == 0}>Add</button>
        </form>
    </div>;
}