import { getAllSoloSessions } from "~/models/solo-sessions.server";
import { Link, useLoaderData, type MetaFunction } from "react-router";
import { format } from "date-fns";

export const meta: MetaFunction = () => [
  { title: "David's Solo Video Library" }
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
      <div className="flex gap-4">
        <div className="card bg-base-100 w-96 shadow-xl">
          <div className="card-body justify-center">
              <Link to={{ pathname: "/solo/add" }}><span className="btn btn-neutral text-white text-center">Add Session</span></Link>
          </div>
        </div>

        {sessions.map((session, idx) => (
          <div className="card bg-base-100 w-96 shadow-xl" key={idx}>
            <div className="card-body">
              <h2 className="card-title">{format(session.date, "dd-MM-yy")}</h2>
              {session.skills.split(",").map((skill, skidx) =>
                <div className="badge badge-accent" key={skidx}>{skill}</div>
              )}
              <div className="card-actions justify-end">
                <Link to={{ pathname: `/solo/${session.id}` }}><span className="btn btn-primary">View</span></Link>
              </div>
            </div>
          </div>
        ))
        }
      </div>
    </div>
  );
}
