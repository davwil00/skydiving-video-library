import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getAllSessionDates } from "~/models/sessions.server";

export const meta: V2_MetaFunction = () => [
  { title: "Chocolate Chip Rookies Video Library" },
];

export const loader = async ({ request }: LoaderArgs) => {
  const sessions = await getAllSessionDates();
  return json({ sessions });
};

export default function Index() {
  return (
    <div className="drawer-content flex flex-col items-center justify-center">
      {/*PAGE CONTENT HERE*/}
      <h1>Chocolate Chip Rookies Video Library</h1>
      Latest session
    </div>
  );
}
