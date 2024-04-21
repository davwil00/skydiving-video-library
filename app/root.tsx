import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration, useLoaderData, useRouteError,
} from '@remix-run/react';
import { getAllSessionDates } from '~/models/sessions.server'
import { json, LinksFunction, LoaderFunctionArgs } from '@remix-run/node'
import Navbar from '~/components/navbar'
import Sidebar from '~/components/sidebar'
import stylesheet from "~/tailwind.css?url";
import { isLocalRequest } from '~/utils/localGuardUtils'
import { useRef } from 'react'

export const loader = async ({request}: LoaderFunctionArgs) => {
  const sessions = await getAllSessionDates();
  const isLocal = isLocalRequest(request)
  return json({sessions, isLocal});
};

export const meta = () => {
    return [
        {title: 'Chocolate Chip Rookies Video Library'},
        {name: 'description', content: ''}
    ];
};

export const links: LinksFunction = () => [
    { rel: "stylesheet", href: stylesheet },
];

export function Layout({children}: { children: React.ReactNode }) {
    const {sessions, isLocal} = useLoaderData<typeof loader>();
    const drawerRef = useRef<HTMLInputElement>(null);
    return (
        <html lang="en" data-theme="dark">
        <head>
            <meta charSet="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <Meta/>
            <Links/>
        </head>

        <body className="h-full">
        <main className="relative min-h-screen bg-white sm:flex sm:justify-center">
          <div className="drawer md:drawer-open">
            <input id="drawer-toggle" type="checkbox" className="drawer-toggle" ref={drawerRef}/>
            <div className="drawer-content">
              <Navbar/>
              <div className="p-4">
                {children}
              </div>
            </div>
            <Sidebar sessions={sessions} isLocal={isLocal} drawerRef={drawerRef}/>
          </div>
        </main>
        <ScrollRestoration/>
        <Scripts/>
        </body>
        </html>
    );
}

export default function App() {
    return <Outlet/>;
}

export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);
  return (
    <html>
    <head>
      <title>Error</title>
      <Meta />
      <Links />
    </head>
    <body>
    <h1>Error</h1>
    <p>Sorry, an error occurred. Please let David know what you were doing at the time and he will try and fix it</p>
    <code>
      {String(error)}
    </code>
    <Scripts />
    </body>
    </html>
  );
}
