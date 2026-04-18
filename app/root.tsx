import {
    isRouteErrorResponse,
    Links,
    type LinksFunction,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useRouteError,
    useRouteLoaderData,
} from 'react-router';
import type { SidebarSession } from '~/components/sidebar';
import { PageStateProvider } from '~/contexts/page-state';
import Main from '~/main';
import { getAllCompetitions } from '~/models/competitions.server';
import { getAllNonCompetitionSessionDates } from '~/models/sessions.server';
import { getAllSoloSessions } from '~/models/solo-sessions.server';
import stylesheet from '~/tailwind.css?url';
import { isLocalRequest } from '~/utils/localGuardUtils';
import { getSiteType, getTheme, SiteType } from '~/utils/site-utils';
import type { Route } from './+types/root';

function getSessions(siteType: SiteType): Promise<SidebarSession[]> {
    switch (siteType) {
        case SiteType.COOKIES:
            return getAllNonCompetitionSessionDates();
        case SiteType.SOLO:
            return getAllSoloSessions();
        default:
            return Promise.resolve([]);
    }
}

export const loader = async ({ request }: Route.LoaderArgs) => {
    const hostName = new URL(request.url).hostname;
    const siteType = getSiteType(hostName);
    const sessions = await getSessions(siteType);
    const competitions = await getAllCompetitions();
    const isLocal = isLocalRequest(request);
    const theme = getTheme(siteType);
    return { sessions, competitions, isLocal, theme, siteType };
};

export const meta = () => {
    return [
        { title: 'Chocolate Chip Cookies Video Library' },
        { name: 'description', content: '' },
    ];
};

export const links: LinksFunction = () => [
    { rel: 'stylesheet', href: stylesheet },
];

export function Layout({ children }: { children: React.ReactNode }) {
    const data = useRouteLoaderData<typeof loader>('root');

    return (
        <html lang="en" data-theme={data?.theme}>
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <Meta />
                <Links />
                <title>Chocolate Chip Cookies Video Library</title>
            </head>

            <body className="h-full">
                <PageStateProvider>
                    <Main data={data}>{children}</Main>
                </PageStateProvider>
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}

export default function App() {
    return <Outlet />;
}

export function ErrorBoundary() {
    const error = useRouteError();
    console.error(error);
    if (isRouteErrorResponse(error)) {
        return (
            <>
                <h1>Error</h1>
                <p>
                    Sorry, an error occurred. Please let David know what you
                    were doing at the time and he will try and fix it
                </p>
                <h1>
                    {error.status}: {error.statusText}
                    <code className="block mt-4">{error.data}</code>
                </h1>
            </>
        );
    }
    return (
        <>
            <h1>Error</h1>
            <p>
                Sorry, an error occurred. Please let David know what you were
                doing at the time and he will try and fix it
            </p>
            <code>{JSON.stringify(error)}</code>
        </>
    );
}
