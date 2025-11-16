import {isLocalRequest} from "~/utils/localGuardUtils";
import {data, useLoaderData} from "react-router";
import {Prisma} from ".prisma/client";
import {createCompetition} from "~/models/competitions.server";
import {Route} from "../../.react-router/types/app/routes/+types/competition.add";
import {getAllSessionDates} from "~/models/sessions.server";
import {formatDate} from "~/utils/utils";

export const loader = async () => {
    const sessions = await getAllSessionDates()
    return data({ sessions });
}

export const action = async ({ request }: Route.ActionArgs) => {
    if (request.method !== "POST" || !isLocalRequest(request)) {
        return data({ message: 'Method not allowed'})
    }

    const formData = await request.formData();

    const competitionData: Prisma.CompetitionCreateInput = {
        date: new Date(formData.get("date") as string),
        name: formData.get("name") as string,
        location: formData.get("location") as string
    };

    await createCompetition(competitionData);

    return data({ message: 'Competition added successfully' });
}
export default function AddCompetition() {
    const { sessions } = useLoaderData<typeof loader>();

    return <div>
        <h1 className="text-2xl">Add Competition</h1>
        <form method="post" className="form-light flex flex-col">
            <label className="form-control w-full max-w-xs">
                <div className="label">
                    <span className="label-text">Date</span>
                </div>
                <input type="date" className="input input-bordered" name="date" />
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
                    <span className="label-text">Session</span>
                </div>
                <select className="select" name="session">
                    {sessions.map((session) => (
                        <option key={session.id} value={session.id}>{formatDate(session.date)}</option>
                    ))}
                </select>
            </label>
            <button type="submit" className="btn mt-4 max-w-xs">Add</button>
        </form>
    </div>;
}