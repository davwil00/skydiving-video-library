import { Link } from 'react-router';
import { format } from 'date-fns';
import { RefObject } from 'react';
import { Session, SoloSession, Competition } from '@prisma/client';
import { usePageStateContext } from '~/contexts/page-state'
import { LibraryType, useLibraryStateContext, useLibraryStateDispatchContext } from '~/contexts/library-state'

type SidebarProps = {
    sessions: Session[];
    soloSessions: SoloSession[];
    competitions: Competition[];
    isLocal: boolean
    drawerRef: RefObject<HTMLInputElement | null>
};

function Divider() {
    return (
        <li>
            <div className="divider"></div>
        </li>
    )
}

export default function Sidebar(props: SidebarProps) {
    const {sessions, soloSessions, competitions, isLocal, drawerRef} = props;
    const {libraryType, canSwitch} = useLibraryStateContext()
    const dispatch = useLibraryStateDispatchContext()
    let sessionsToShow: { id: string, date: Date, name?: string | null }[];
    switch (libraryType) {
        case LibraryType.TEAM:
            sessionsToShow = sessions
            break
        case LibraryType.SOLO:
            sessionsToShow = soloSessions
            break
        default:
            sessionsToShow = []
            break
    }
    const sessionsByYear = Object.groupBy(sessionsToShow, (session) => new Date(session.date).getFullYear().toString());
    const clickCallback = () => drawerRef.current && (drawerRef.current.checked = false);
    const {isFullScreen} = usePageStateContext()

    if (isFullScreen) {
        return null
    }

    enum FormationLinkType {
        FOUR_WAY = '/formation',
        EIGHT_WAY = '/8-way/formation'
    }

    function makeLink(letter: string, type: FormationLinkType) {
        return <Link to={{pathname: `${type}/${letter}`}}
                     onClick={clickCallback}
                     key={letter}
        >
            <kbd className="kbd">{letter}</kbd>
        </Link>;
    }

    function makeLinkBlock(formationIds: string[], type: FormationLinkType, key: string) {
        return <li key={key}>
            <div className="flex justify-around">
                {formationIds.map((letter) => makeLink(letter, type))}
            </div>
        </li>;
    }

    return (
        <div className="drawer-side overflow-x-hidden">
            <label htmlFor="drawer-toggle" className="drawer-overlay"></label>
            <div className="min-h-full bg-base-200 w-80">
                <ul className="menu w-80 px-4 pt-4 text-base-content flex-nowrap">
                    <li><Link to={{pathname: '/'}} onClick={clickCallback}>Home</Link></li>
                    {canSwitch ? <fieldset className="fieldset">
                        <label className="label">Library</label>
                        <select className="select select-sm"
                                defaultValue={libraryType}
                                onChange={(e) => dispatch({ type: 'setLibraryState', value: e.target.value as LibraryType })}>
                            {Object.entries(LibraryType).map(([value, name]) => (
                                <option key={value} value={name}>{name}</option>
                            ))}
                        </select>
                    </fieldset> : null}
                    <li>
                        <h2 className="menu-title">Sessions</h2>
                        <ul>
                            {Object.entries(sessionsByYear).map(([year, sessions], idx) => (
                                <div className="collapse" key={`year-${idx}`}>
                                    <input type="checkbox"/>
                                    <div className="collapse-title">
                                        {year}
                                    </div>
                                    <div className="collapse-content">
                                        {sessions?.map((session, idx) => (
                                            <li key={`session-${idx}`}>
                                                <Link
                                                    to={{
                                                        pathname: `${libraryType === LibraryType.SOLO ? '/solo' : '/session'}/${session.id}`
                                                    }}
                                                    onClick={clickCallback}
                                                >
                                                    {session.name ?? format(new Date(session.date), 'dd/MM')}
                                                </Link>
                                            </li>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </ul>
                    </li>
                    <li>
                        <h2 className="menu-title">Competitions</h2>
                        <ul>
                            {competitions?.map((competition, idx) => (
                                <li key={`competition-${idx}`}>
                                    <Link
                                        to={{pathname: `/competition/${competition.id}`}}
                                        onClick={clickCallback}
                                    >
                                        {competition.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </li>
                    <Divider/>
                </ul>

                {libraryType === LibraryType.SOLO ? (
                    <ul className="menu p-4 pt-0 text-base-content flex-nowrap">
                        <li>
                        {isLocal ? <Link to={{pathname: '/solo/add'}}
                                         onClick={clickCallback}>Add solo session</Link> : null}
                        </li>
                    </ul>
                    ) : null }
                {libraryType === LibraryType.TEAM ?
                    (<ul className="menu p-4 pt-0 text-base-content flex-nowrap">
                        <li>
                            <Link to={{pathname: '/quiz'}}
                                  onClick={clickCallback}>Quiz</Link>
                            <Link to={{pathname: '/8-way-quiz'}}
                                  onClick={clickCallback}>8 Way Quiz</Link>
                            {isLocal ? <Link to={{pathname: '/tag'}}
                                             onClick={clickCallback}>Tag</Link> : null}
                            {isLocal ? <Link to={{pathname: '/trim-pending'}}
                                             onClick={clickCallback}>Trim Pending</Link> : null}
                            <Link to={{pathname: '/logos'}}
                                  onClick={clickCallback}>Logos</Link>
                            <Link to={{pathname: '/customise-logo'}}
                                  onClick={clickCallback}>Customise Logo</Link>
                            <Link to={{pathname: '/8-way-nationals-2024'}}
                                  onClick={clickCallback}>8 Way (Nationals 2024) 🥈</Link>
                            <Link to={{pathname: '/8-way/dive-builder'}}
                                  onClick={clickCallback}>8 Way Dive Builder</Link>
                        </li>
                        <Divider/>
                        <li className="items-start">
                            <h2 className="menu-title">Randoms</h2>
                            <ul>
                                {[
                                    ['A', 'B', 'C', 'D'],
                                    ['E', 'F', 'G', 'H'],
                                    ['J', 'K', 'L', 'M'],
                                    ['N', 'O', 'P', 'Q']
                                ].map((formation, idx) => makeLinkBlock(formation, FormationLinkType.FOUR_WAY, `4rand${idx}`))}
                            </ul>
                        </li>
                        <Divider/>
                        <li className="items-start">
                            <h2 className="menu-title">A Blocks</h2>
                            <ul>
                                {[
                                    ['2','4','6','7'],
                                    ['8','9','19','21']
                                ].map((formation, idx) => makeLinkBlock(formation, FormationLinkType.FOUR_WAY, `4block${idx}`))}
                            </ul>
                        </li>
                        <li className="items-start">
                            <h2 className="menu-title">AA Blocks</h2>
                            <ul>
                                {[
                                    ['1', '11', '13', '14'],
                                    ['15', '18', '20', '22']
                                ].map((formation, idx) => makeLinkBlock(formation, FormationLinkType.FOUR_WAY, `4block${idx}`))}
                            </ul>
                        </li>
                        <li className="items-start">
                            <h2 className="menu-title">AAA Blocks</h2>
                            <ul>
                                {[
                                    ['3', '5', '10'],
                                    ['12','16', '17']
                                ].map((formation, idx) => makeLinkBlock(formation, FormationLinkType.FOUR_WAY, `4block${idx}`))}
                            </ul>
                        </li>
                        <li className="items-start">
                            <h2 className="menu-title">8 Way Randoms</h2>
                            <ul>
                                {[
                                    ['A', 'B', 'C', 'D'],
                                    ['E', 'F', 'G', 'H'],
                                    ['J', 'K', 'L', 'M'],
                                    ['N', 'O', 'P', 'Q']
                                ].map((formation, idx) => makeLinkBlock(formation, FormationLinkType.EIGHT_WAY, `8rand${idx}`))}
                            </ul>
                        </li>
                        <li className="items-start">
                            <h2 className="menu-title">8 Way Blocks</h2>
                            <ul>
                                {[
                                    ['1','2','3','4'],
                                    ['5','6','7','8'],
                                    ['9','10','11','12'],
                                    ['13', '14', '15', '16'],
                                    ['17','18','19','20'],
                                    ['21','22'],
                                ].map((formation, idx) => makeLinkBlock(formation, FormationLinkType.EIGHT_WAY, `8block${idx}`))}
                            </ul>
                        </li>
                        <Divider/>
                        <ul>
                            <form className="join" action="/search" method="GET">
                                <label className="input input-bordered flex items-center gap-2 join-item w-[75%]">
                                    <input type="text" className="" placeholder="Search" name="query"/>
                                </label>
                                <button className="btn btn-neutral join-item">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 16 16"
                                        fill="currentColor"
                                        className="h-4 w-4 opacity-70">
                                        <path
                                            fillRule="evenodd"
                                            d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                                            clipRule="evenodd"/>
                                    </svg>
                                </button>
                            </form>
                        </ul>
                    </ul>) : null}
            </div>
        </div>
    )
}
