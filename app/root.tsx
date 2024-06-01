import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration, useLoaderData,
} from '@remix-run/react';
import { getAllSessionDates } from '~/models/sessions.server'
import { json, LinksFunction } from '@remix-run/node'
import Navbar from '~/components/navbar'
import Sidebar from '~/components/sidebar'
import { isLocalRequest } from '~/utils/localGuardUtils';
import stylesheet from '~/tailwind.css?url';
import { LoaderFunctionArgs } from '@remix-run/router'
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
  {rel: 'stylesheet', href: stylesheet},
];

export function Layout({children}: { children: React.ReactNode }) {
  const {sessions, isLocal} = useLoaderData<typeof loader>();
  const drawerRef = useRef<HTMLInputElement>(null);
  return (
    <html lang="en" data-theme="dark">
    <head>
      <meta charSet="utf-8"/>
      <meta name="viewport" content="width=device-width, initial-scale=1"/>
      <title>Chocolate Chip Rookies Video Library</title>
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
