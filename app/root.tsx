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
  useLoaderData
} from "@remix-run/react";

import stylesheet from "~/tailwind.css";
import Sidebar from "~/components/sidebar";
import { getAllSessionDates } from "~/models/sessions.server";
import Navbar from "~/components/navbar";
import { isLocalRequest } from "~/utils/localGuardUtils";
import { useRef } from "react";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : [])
];

export const loader = async ({request}: LoaderArgs) => {
  const sessions = await getAllSessionDates();
  const isLocal = isLocalRequest(request)
  return json({ sessions, isLocal });
};

export const meta = () => {
  return [
    { title: "Chocolate Chip Rookies Video Library" },
    { name: "description", content: "" }
  ];
};

export default function App() {
  const { sessions, isLocal } = useLoaderData<typeof loader>();
  const drawerRef = useRef<HTMLInputElement>(null);
  return (
    <html lang="en" className="h-full" data-theme="bumblebee">
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <Meta />
      <Links />
    </head>
    <body className="h-full">
    <main className="relative min-h-screen bg-white sm:flex sm:justify-center">
      <div className="drawer md:drawer-open">
        <input id="drawer-toggle" type="checkbox" className="drawer-toggle" ref={drawerRef} />
        <div className="drawer-content">
          <Navbar />
          <div className="p-4">
            <Outlet />
          </div>
        </div>
        <Sidebar sessions={sessions} isLocal={isLocal} drawerRef={drawerRef} />
      </div>
    </main>
    <ScrollRestoration />
    <Scripts />
    <LiveReload />
    </body>
    </html>
  );
}
