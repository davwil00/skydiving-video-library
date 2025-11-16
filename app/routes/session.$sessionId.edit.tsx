import invariant from 'tiny-invariant';
import {getSession, updateSession} from '~/models/sessions.server';
import {useLoaderData} from 'react-router';
import {isLocalRequest} from '~/utils/localGuardUtils';
import type {Route} from './+types/session.$sessionId.edit';
import {useState} from "react";
import {format} from "date-fns";

export const loader = async ({params, request}: Route.LoaderArgs) => {
    invariant(params.sessionId, "session not found");
    const isLocal = isLocalRequest(request)

    const session = await getSession(params.sessionId);
    if (!session) {
        throw new Response("Not Found", {status: 404});
    }
    return {session, isLocal};
};

export const action = async ({params, request}: Route.ActionArgs) => {
    if (request.method !== 'POST' || !isLocalRequest(request)) {
        return new Response('Method not allowed', {status: 405});
    }

    const formData = await request.formData();
    const name = formData.get('name') as string;
    const dateStr = formData.get('date') as string;
    const date = new Date(dateStr);

    invariant(dateStr, 'Date is required');

    const sessionId = params.sessionId

    await updateSession({id: sessionId, name, date});

    return new Response(null, {status: 200, headers: {Location: `/session/${sessionId}`}});
};

export default function SessionDetailsPage() {
    const {session} = useLoaderData<typeof loader>();
    const [name, setName] = useState<string>(session.name ?? '');
    const [date, setDate] = useState<string>(format(session.date, 'yyyy-MM-dd'));

    return (
        <div>
            <h1>Edit Session</h1>
            <form method="post" className="form-light flex flex-col">
                <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text">Name</span>
                    </div>
                    <input type="text" className="input input-bordered" name="name" value={name}
                           onChange={(e) => setName(e.target.value)}/>
                </label>
                <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text">Date</span>
                    </div>
                    <input type="date" className="input input-bordered" name="date" value={date}
                           onChange={(e) => setDate(e.target.value)}/>
                </label>
                <button className="btn mt-4 max-w-xs" type="submit">Save</button>
            </form>
        </div>
    );
}
