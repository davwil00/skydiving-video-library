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

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : [])
];

export const loader = async ({ request }: LoaderArgs) => {
  const sessions = await getAllSessionDates();
  return json({ sessions });
};

export const meta = () => {
  return [
    { title: "Chocolate Chip Rookies Video Library" },
    { name: "description", content: "" }
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
    <main className="relative min-h-screen bg-white sm:flex sm:justify-center">
      <div className="drawer md:drawer-open">
        <input id="drawer-toggle" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <div className="w-full navbar bg-base-200">
            <div className="flex-none md:hidden">
              <label htmlFor="drawer-toggle" className="btn btn-square btn-ghost">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                     className="inline-block w-6 h-6 stroke-current">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </label>
            </div>
            <div className="flex-1 px-2 mx-2">Chocolate Chip Rookies Video Library</div>
            <div className="flex-none hidden lg:block">
              <ul className="menu menu-horizontal">
                {/* Navbar menu content here */}
              </ul>
            </div>
          </div>
          <div className="p-4">
            <Outlet />
          </div>
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
