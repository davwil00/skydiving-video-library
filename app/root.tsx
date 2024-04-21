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
import stylesheet from "~/tailwind.css?url";

export const loader = async () => {
    const sessions = await getAllSessionDates();
    return json({sessions});
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
    const {sessions} = useLoaderData<typeof loader>();
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
                <input id="drawer-toggle" type="checkbox" className="drawer-toggle"/>
                <div className="drawer-content">
                    <Navbar/>
                    <div className="p-4">
                        {children}
                    </div>
                </div>
                <Sidebar sessions={sessions}/>
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
