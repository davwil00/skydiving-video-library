import { format } from 'date-fns';
import type { Competition } from 'prisma/generated/client';
import type React from 'react';
import type { RefObject } from 'react';
import { Link } from 'react-router';
import { usePageStateContext } from '~/contexts/page-state';
import { useSiteStateContext } from '~/contexts/site-state';
import { SiteType } from '~/utils/site-utils';

export type SidebarSession = { id: string; date: Date; name?: string | null };
type SidebarProps = {
    sessions: SidebarSession[];
    competitions: Competition[];
    isLocal: boolean;
    drawerRef: RefObject<HTMLInputElement | null>;
};

function Divider() {
    return (
        <li>
            <div className="divider"></div>
        </li>
    );
}

export default function Sidebar(props: SidebarProps) {
    const { sessions, competitions, isLocal, drawerRef } = props;
    const { siteType } = useSiteStateContext();
    const sessionsByYear = Object.groupBy(sessions, (session) =>
        new Date(session.date).getFullYear().toString(),
    );
    const clickCallback = () => {
        if (drawerRef.current) {
            drawerRef.current.checked = false;
        }
    };
    const { isFullScreen } = usePageStateContext();

    if (isFullScreen) {
        return null;
    }

    enum FormationLinkType {
        FOUR_WAY = '/formation',
        EIGHT_WAY = '/8-way/formation',
    }

    function makeLink(letter: string, type: FormationLinkType) {
        return (
            <Link
                to={{ pathname: `${type}/${letter}` }}
                onClick={clickCallback}
                key={letter}
            >
                <kbd className="kbd">{letter}</kbd>
            </Link>
        );
    }

    function makeLinkBlock(
        formationIds: string[],
        type: FormationLinkType,
        key: string,
    ) {
        return (
            <li key={key}>
                <div className="flex justify-around">
                    {formationIds.map((letter) => makeLink(letter, type))}
                </div>
            </li>
        );
    }

    function getMedalFromRank(rank: number | null): string {
        switch (rank) {
            case 1:
                return ' 🥇';
            case 2:
                return ' 🥈';
            case 3:
                return ' 🥉';
            default:
                return '';
        }
    }

    function SessionLinks() {
        if (Object.keys(sessionsByYear).length === 0) {
            return null;
        }
        return (
            <li>
                <h2 className="menu-title">Sessions</h2>
                <ul>
                    {Object.entries(sessionsByYear).map(([year, sessions]) => (
                        <div className="collapse" key={`year-${year}`}>
                            <input type="checkbox" />
                            <div className="collapse-title">{year}</div>
                            <div className="collapse-content">
                                {sessions?.map((session) => (
                                    <li key={`session-${session.id}`}>
                                        <Link
                                            to={{
                                                pathname: `${siteType === SiteType.SOLO ? '/solo' : '/session'}/${session.id}`,
                                            }}
                                            onClick={clickCallback}
                                        >
                                            {session.name ??
                                                format(
                                                    new Date(session.date),
                                                    'dd/MM',
                                                )}
                                        </Link>
                                    </li>
                                ))}
                            </div>
                        </div>
                    ))}
                </ul>
            </li>
        );
    }

    function CompetitionLinks() {
        if (siteType === SiteType.TUNNEL_VISION) {
            return null;
        }
        return (
            <li>
                <h2 className="menu-title">Competitions</h2>
                <ul>
                    {competitions?.map((competition) => (
                        <li key={`competition-${competition.id}`}>
                            <Link
                                to={{
                                    pathname: `/competition/${competition.id}`,
                                }}
                                onClick={clickCallback}
                            >
                                {competition.name}
                                {getMedalFromRank(competition.rank)}
                            </Link>
                        </li>
                    ))}
                    {isLocal ? (
                        <li>
                            <a href="/competition/add">Add</a>
                        </li>
                    ) : null}
                </ul>
            </li>
        );
    }

    function FormationLinks(props: {
        title: string;
        formations: string[][];
        linkType: FormationLinkType;
    }) {
        const { title, formations, linkType } = props;
        return (
            <li className="items-start">
                <h2 className="menu-title">{title}</h2>
                <ul>
                    {formations.map((formation) =>
                        makeLinkBlock(
                            formation,
                            linkType,
                            `${linkType}-${formation}`,
                        ),
                    )}
                </ul>
            </li>
        );
    }

    function LinkWithGuard(props: {
        requiresLocal: boolean;
        requiredSiteType?: SiteType;
        children: React.ReactNode;
    }) {
        const { requiresLocal, requiredSiteType, children } = props;
        if (
            requiresLocal &&
            isLocal &&
            requiredSiteType &&
            requiredSiteType === siteType
        ) {
            return children;
        }
        return null;
    }

    return (
        <div className="drawer-side overflow-x-hidden">
            {/** biome-ignore lint/a11y/noLabelWithoutControl: this will always be there */}
            <label htmlFor="drawer-toggle" className="drawer-overlay"></label>
            <div className="min-h-full bg-base-200 w-80">
                <ul className="menu w-80 px-4 pt-4 text-base-content flex-nowrap">
                    <li>
                        <Link to={{ pathname: '/' }} onClick={clickCallback}>
                            Home
                        </Link>
                    </li>
                    <SessionLinks />
                    <CompetitionLinks />
                    <Divider />
                </ul>

                {siteType === SiteType.SOLO ? (
                    <ul className="menu p-4 pt-0 text-base-content flex-nowrap">
                        <li>
                            {isLocal ? (
                                <Link
                                    to={{ pathname: '/solo/add' }}
                                    onClick={clickCallback}
                                >
                                    Add solo session
                                </Link>
                            ) : null}
                        </li>
                    </ul>
                ) : null}
                <ul className="menu p-4 pt-0 text-base-content flex-nowrap">
                    <li>
                        <Link
                            to={{ pathname: '/quiz' }}
                            onClick={clickCallback}
                        >
                            Quiz
                        </Link>
                        <LinkWithGuard requiresLocal={true}>
                            <Link
                                to={{ pathname: '/tag' }}
                                onClick={clickCallback}
                            >
                                Tag
                            </Link>
                        </LinkWithGuard>
                        <LinkWithGuard requiresLocal={true}>
                            <Link
                                to={{ pathname: '/trim-pending' }}
                                onClick={clickCallback}
                            >
                                Trim Pending
                            </Link>
                        </LinkWithGuard>
                        <LinkWithGuard
                            requiresLocal={false}
                            requiredSiteType={SiteType.COOKIES}
                        >
                            <Link
                                to={{ pathname: '/logos' }}
                                onClick={clickCallback}
                            >
                                Logos
                            </Link>
                        </LinkWithGuard>
                        <LinkWithGuard
                            requiresLocal={false}
                            requiredSiteType={SiteType.COOKIES}
                        >
                            <Link
                                to={{ pathname: '/customise-logo' }}
                                onClick={clickCallback}
                            >
                                Customise Logo
                            </Link>
                        </LinkWithGuard>
                        <LinkWithGuard
                            requiresLocal={false}
                            requiredSiteType={SiteType.COOKIES}
                        >
                            <Link
                                to={{ pathname: '/8-way-nationals-2024' }}
                                onClick={clickCallback}
                            >
                                8 Way (Nationals 2024) 🥈
                            </Link>
                        </LinkWithGuard>
                        <Link
                            to={{ pathname: '/8-way/dive-builder' }}
                            onClick={clickCallback}
                        >
                            8 Way Dive Builder
                        </Link>
                    </li>
                    {siteType === SiteType.COOKIES ? (
                        <>
                            <FormationLinks
                                title="Randoms"
                                formations={[
                                    ['A', 'B', 'C', 'D'],
                                    ['E', 'F', 'G', 'H'],
                                    ['J', 'K', 'L', 'M'],
                                    ['N', 'O', 'P', 'Q'],
                                ]}
                                linkType={FormationLinkType.FOUR_WAY}
                            />
                            <Divider />
                            <FormationLinks
                                title="A Blocks"
                                formations={[
                                    ['2', '4', '6', '7'],
                                    ['8', '9', '19', '21'],
                                ]}
                                linkType={FormationLinkType.FOUR_WAY}
                            />
                            <FormationLinks
                                title="AA Blocks"
                                formations={[
                                    ['1', '11', '13', '14'],
                                    ['15', '18', '20', '22'],
                                ]}
                                linkType={FormationLinkType.FOUR_WAY}
                            />
                            <FormationLinks
                                title="AAA Blocks"
                                formations={[
                                    ['3', '5', '10'],
                                    ['12', '16', '17'],
                                ]}
                                linkType={FormationLinkType.FOUR_WAY}
                            />
                        </>
                    ) : null}
                    <Divider />
                    <FormationLinks
                        title="8 Way Randoms"
                        formations={[
                            ['A', 'B', 'C', 'D'],
                            ['E', 'F', 'G', 'H'],
                            ['J', 'K', 'L', 'M'],
                            ['N', 'O', 'P', 'Q'],
                        ]}
                        linkType={FormationLinkType.EIGHT_WAY}
                    />
                    <FormationLinks
                        title="8 Way Blocks"
                        formations={[
                            ['1', '2', '3', '4'],
                            ['5', '6', '7', '8'],
                            ['9', '10', '11', '12'],
                            ['13', '14', '15', '16'],
                            ['17', '18', '19', '20'],
                            ['21', '22'],
                        ]}
                        linkType={FormationLinkType.EIGHT_WAY}
                    />
                    <Divider />
                    <ul>
                        <form className="join" action="/search" method="GET">
                            <label className="input input-bordered flex items-center gap-2 join-item w-[75%]">
                                <input
                                    type="text"
                                    className=""
                                    placeholder="Search"
                                    name="query"
                                />
                            </label>
                            <button
                                className="btn btn-neutral join-item"
                                type="submit"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 16 16"
                                    fill="currentColor"
                                    className="h-4 w-4 opacity-70"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>
                        </form>
                    </ul>
                </ul>
            </div>
        </div>
    );
}
