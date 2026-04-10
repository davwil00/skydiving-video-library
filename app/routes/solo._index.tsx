import { format } from 'date-fns';
import { Link, type MetaFunction, useLoaderData } from 'react-router';
import { getAllSoloSessions } from '~/models/solo-sessions.server';

export const meta: MetaFunction = () => [
    { title: "David's Solo Video Library" },
];

export const loader = async () => {
    const sessions = await getAllSoloSessions();
    return sessions;
};

export default function Solo_index() {
    const sessions = useLoaderData<typeof loader>();
    return (
        <div>
            <h1 className="text-2xl text-black">Solo</h1>
            <div className="flex flex-wrap gap-4">
                {sessions.map((session) => (
                    <div
                        className="card bg-base-100 w-96 shadow-xl"
                        key={session.id}
                    >
                        <div className="card-body">
                            <h2 className="card-title text-white">
                                {format(session.date, 'dd-MM-yy')}
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {session.skills.split(',').map((skill) => (
                                    <div
                                        className="badge badge-accent"
                                        key={skill}
                                    >
                                        {skill}
                                    </div>
                                ))}
                            </div>
                            <div className="card-actions justify-end">
                                <Link to={{ pathname: `/solo/${session.id}` }}>
                                    <span className="btn btn-primary">
                                        View
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
