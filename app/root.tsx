import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";

import stylesheet from "~/tailwind.css";
import Sidebar from "~/components/sidebar";
import { getAllSessionDates } from "~/models/sessions.server";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export const loader = async ({ request }: LoaderArgs) => {
  const sessions = await getAllSessionDates();
  return json({ sessions });
};

export const meta = () => {
  return [
    { title: "Chocolate Chip Rookies Video Library" },
    { name: "description", content: "" },
  ];
};

export default function App() {
  const { sessions } = useLoaderData<typeof loader>();
  return (
    <html lang="en" className="h-full" data-theme="bumblebee">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <main className="relative min-h-screen bg-white sm:flex sm:items-center sm:justify-center">
          <div className="drawer lg:drawer-open">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content p-4">
              <Outlet />
            </div>
            <Sidebar sessions={sessions} />
          </div>
        </main>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
