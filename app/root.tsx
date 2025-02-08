import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
  useRouteLoaderData,
  LinksFunction
} from 'react-router';
import { getAllSessionDates } from '~/models/sessions.server'
import Navbar from '~/components/navbar'
import Sidebar from '~/components/sidebar'
import stylesheet from "~/tailwind.css?url";
import { isLocalRequest } from '~/utils/localGuardUtils'
import { useRef } from 'react'
import type { Route } from './+types/root'

export const loader = async ({request}: Route.LoaderArgs) => {
  const sessions = await getAllSessionDates();
  const isLocal = isLocalRequest(request)
  return {sessions, isLocal};
};

export const meta = () => {
    return [
        {title: 'Chocolate Chip Cookies Video Library'},
        {name: 'description', content: ''}
    ];
};

export const links: LinksFunction = () => [
    { rel: "stylesheet", href: stylesheet },
];

export function Layout({children}: { children: React.ReactNode }) {
  const data = useRouteLoaderData<typeof loader>('root');
    const drawerRef = useRef<HTMLInputElement>(null);
    return (
        <html lang="en" data-theme="dark">
        <head>
            <meta charSet="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <Meta/>
            <Links/>
            <title>Chocolate Chip Cookies Video Library</title>
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
        <Sidebar sessions={data?.sessions || []} isLocal={data?.isLocal || false} drawerRef={drawerRef}/>
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
  if (isRouteErrorResponse(error)) {
    return (<>
      <h1>Error</h1>
      <p>Sorry, an error occurred. Please let David know what you were doing at the time and he will try and fix it</p>
      <h1>
        {error.status}: {error.statusText}
        <code className="block mt-4">
          {error.data}
        </code>
      </h1>
    </>)
  }
  return (
    <>
      <h1>Error</h1>
      <p>Sorry, an error occurred. Please let David know what you were doing at the time and he will try and fix it</p>
      <code>
        {JSON.stringify(error)}
      </code>
    </>
  );
}
