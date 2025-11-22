import {
    isRouteErrorResponse,
    Links,
    LinksFunction,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useRouteError, useRouteLoaderData
} from 'react-router';
import { getAllNonCompetitionSessionDates } from '~/models/sessions.server'
import { getAllSoloSessions } from '~/models/solo-sessions.server'
import { getAllCompetitions} from "~/models/competitions.server";
import stylesheet from '~/tailwind.css?url';
import { isLocalRequest } from '~/utils/localGuardUtils'
import type { Route } from './+types/root'
import { PageStateProvider } from '~/contexts/page-state'
import Main from '~/main'

export const loader = async ({request}: Route.LoaderArgs) => {

    const sessions = await getAllNonCompetitionSessionDates();
    const soloSessions = await getAllSoloSessions();
    const competitions = await getAllCompetitions();
    const isLocal = isLocalRequest(request)
    const hostName = request.url
    return {sessions, soloSessions, competitions, isLocal, hostName};
};

export const meta = () => {
    return [
        {title: 'Chocolate Chip Cookies Video Library'},
        {name: 'description', content: ''}
    ];
};

export const links: LinksFunction = () => [
    {rel: 'stylesheet', href: stylesheet},
];

export function Layout({children}: { children: React.ReactNode }) {
    const data = useRouteLoaderData<typeof loader>('root');

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
        <PageStateProvider>
            <Main data={data}>
                {children}
            </Main>
        </PageStateProvider>
        <ScrollRestoration/>
        <Scripts/>
        </body>
        </html>
    )
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
            <p>Sorry, an error occurred. Please let David know what you were doing at the time and he will try and fix
                it</p>
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
            <p>Sorry, an error occurred. Please let David know what you were doing at the time and he will try and fix
                it</p>
            <code>
                {JSON.stringify(error)}
            </code>
        </>
    );
}
