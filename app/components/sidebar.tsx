import { Link } from 'react-router';
import { format } from 'date-fns';
import { RefObject } from 'react';
import { Session, SoloSession } from '@prisma/client';
import { usePageStateContext } from '~/contexts/page-state'
import { LibraryType, useLibraryStateContext, useLibraryStateDispatchContext } from '~/contexts/library-state'

type SidebarProps = {
    sessions: Session[];
    soloSessions: SoloSession[];
    isLocal: boolean
    drawerRef: RefObject<HTMLInputElement | null>
};

export default function Sidebar(props: SidebarProps) {
    const {sessions, soloSessions, isLocal, drawerRef} = props;
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
    const sessionsByYear = sessionsToShow
        .reduce((groups, session) => {
            const year = new Date(session.date).getFullYear().toString();
            if (groups[year]) {
                return {
                    ...groups,
                    [year]: [
                        ...groups[year],
                        session
                    ]
                };
            } else {
                return {
                    ...groups,
                    [year]: [session]
                };
            }
        }, {} as { [year: string]: { id: string, date: Date, name?: string | null }[] });
    const clickCallback = () => drawerRef.current && (drawerRef.current.checked = false);
    const {isFullScreen} = usePageStateContext()

    if (isFullScreen) {
        return null
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
                                        {sessions.map((session, idx) => (
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
                        <div className="divider"></div>
                    </li>
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
                        </li>
                        <li>
                            <div className="divider"></div>
                        </li>
                        <li className="items-start">
                            <h2 className="menu-title">Randoms</h2>
                            <ul>
                                <li>
                                    <div className="flex justify-around">
                                        {['A', 'B', 'C', 'D'].map((letter) => (
                                            <Link to={{pathname: `/formation/${letter}`}}
                                                  onClick={clickCallback}
                                                  key={letter}
                                            >
                                                <kbd className="kbd">{letter}</kbd>
                                            </Link>
                                        ))}
                                    </div>
                                </li>
                                <li>
                                    <div className="flex justify-around">
                                        {['E', 'F', 'G', 'H'].map((letter) => (
                                            <Link to={{pathname: `/formation/${letter}`}}
                                                  onClick={clickCallback}
                                                  key={letter}
                                            >
                                                <kbd className="kbd">{letter}</kbd>
                                            </Link>
                                        ))}
                                    </div>
                                </li>
                                <li>
                                    <div className="flex justify-around">
                                        {['J', 'K', 'L', 'M'].map((letter) => (
                                            <Link to={{pathname: `/formation/${letter}`}}
                                                  onClick={clickCallback}
                                                  key={letter}
                                            >
                                                <kbd className="kbd">{letter}</kbd>
                                            </Link>
                                        ))}
                                    </div>
                                </li>
                                <li>
                                    <div className="flex justify-around">
                                        {['N', 'O', 'P', 'Q'].map((letter) => (
                                            <Link to={{pathname: `/formation/${letter}`}}
                                                  onClick={clickCallback}
                                                  key={letter}
                                            >
                                                <kbd className="kbd">{letter}</kbd>
                                            </Link>
                                        ))}
                                    </div>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <div className="divider"></div>
                        </li>
                        <li className="items-start">
                            <h2 className="menu-title">A Blocks</h2>
                            <ul>
                                <li>
                                    <div className="flex justify-around">
                                        {['2', '4', '6', '7'].map((letter) => (
                                            <Link to={{pathname: `/formation/${letter}`}}
                                                  onClick={clickCallback}
                                                  key={letter}
                                            >
                                                <kbd className="kbd">{letter}</kbd>
                                            </Link>
                                        ))}
                                    </div>
                                </li>
                                <li>
                                    <div className="flex justify-around">
                                        {['8', '9', '19', '21'].map((letter) => (
                                            <Link to={{pathname: `/formation/${letter}`}}
                                                  onClick={clickCallback}
                                                  key={letter}
                                            >
                                                <kbd className="kbd">{letter}</kbd>
                                            </Link>
                                        ))}
                                    </div>
                                </li>
                            </ul>
                        </li>
                        <li className="items-start">
                            <h2 className="menu-title">AA Blocks</h2>
                            <ul>
                                <li>
                                    <div className="flex justify-around">
                                        {['1', '11', '13', '14'].map((letter) => (
                                            <Link to={{pathname: `/formation/${letter}`}}
                                                  onClick={clickCallback}
                                                  key={letter}
                                            >
                                                <kbd className="kbd">{letter}</kbd>
                                            </Link>
                                        ))}
                                    </div>
                                </li>
                                <li>
                                    <div className="flex justify-around">
                                        {['15', '18', '20', '22'].map((letter) => (
                                            <Link to={{pathname: `/formation/${letter}`}}
                                                  onClick={clickCallback}
                                                  key={letter}
                                            >
                                                <kbd className="kbd">{letter}</kbd>
                                            </Link>
                                        ))}
                                    </div>
                                </li>
                            </ul>
                        </li>
                        <li className="items-start">
                            <h2 className="menu-title">AAA Blocks</h2>
                            <ul>
                                <li>
                                    <div className="flex justify-around">
                                        {['3', '5', '10'].map((letter) => (
                                            <Link to={{pathname: `/formation/${letter}`}}
                                                  onClick={clickCallback}
                                                  key={letter}
                                            >
                                                <kbd className="kbd">{letter}</kbd>
                                            </Link>
                                        ))}
                                    </div>
                                </li>
                                <li>
                                    <div className="flex justify-around">
                                        {['12', '16', '17'].map((letter) => (
                                            <Link to={{pathname: `/formation/${letter}`}}
                                                  onClick={clickCallback}
                                                  key={letter}
                                            >
                                                <kbd className="kbd">{letter}</kbd>
                                            </Link>
                                        ))}
                                    </div>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <div className="divider"></div>
                        </li>
                        <li className="items-start">
                            <h2 className="menu-title">8 Way Randoms</h2>
                            <ul>
                                <li>
                                    <div className="flex justify-around">
                                        {['A', 'B', 'C', 'D'].map((letter) => (
                                            <Link to={{pathname: `/8-way/formation/${letter}`}}
                                                  onClick={clickCallback}
                                                  key={letter}
                                            >
                                                <kbd className="kbd">{letter}</kbd>
                                            </Link>
                                        ))}
                                    </div>
                                </li>
                                <li>
                                    <div className="flex justify-around">
                                        {['E', 'F', 'G', 'H'].map((letter) => (
                                            <Link to={{pathname: `/8-way/formation/${letter}`}}
                                                  onClick={clickCallback}
                                                  key={letter}
                                            >
                                                <kbd className="kbd">{letter}</kbd>
                                            </Link>
                                        ))}
                                    </div>
                                </li>
                                <li>
                                    <div className="flex justify-around">
                                        {['J', 'K', 'L', 'M'].map((letter) => (
                                            <Link to={{pathname: `/8-way/formation/${letter}`}}
                                                  onClick={clickCallback}
                                                  key={letter}
                                            >
                                                <kbd className="kbd">{letter}</kbd>
                                            </Link>
                                        ))}
                                    </div>
                                </li>
                                <li>
                                    <div className="flex justify-around">
                                        {['N', 'O', 'P', 'Q'].map((letter) => (
                                            <Link to={{pathname: `/8-way/formation/${letter}`}}
                                                  onClick={clickCallback}
                                                  key={letter}
                                            >
                                                <kbd className="kbd">{letter}</kbd>
                                            </Link>
                                        ))}
                                    </div>
                                </li>
                            </ul>
                        </li>
                        <li className="items-start">
                            <h2 className="menu-title">8 Way Blocks</h2>
                            <ul>
                                <li>
                                    <div className="flex justify-around">
                                        {['1', '2', '3', '4'].map((letter) => (
                                            <Link to={{pathname: `/8-way/formation/${letter}`}}
                                                  onClick={clickCallback}
                                                  key={letter}
                                            >
                                                <kbd className="kbd">{letter}</kbd>
                                            </Link>
                                        ))}
                                    </div>
                                </li>
                                <li>
                                    <div className="flex justify-around">
                                        {['5', '6', '7', '8'].map((letter) => (
                                            <Link to={{pathname: `/8-way/formation/${letter}`}}
                                                  onClick={clickCallback}
                                                  key={letter}
                                            >
                                                <kbd className="kbd">{letter}</kbd>
                                            </Link>
                                        ))}
                                    </div>
                                </li>
                                <li>
                                    <div className="flex justify-around">
                                        {['9', '10', '11', '12'].map((letter) => (
                                            <Link to={{pathname: `/8-way/formation/${letter}`}}
                                                  onClick={clickCallback}
                                                  key={letter}
                                            >
                                                <kbd className="kbd">{letter}</kbd>
                                            </Link>
                                        ))}
                                    </div>
                                </li>
                                <li>
                                    <div className="flex justify-around">
                                        {['13', '14', '15', '16'].map((letter) => (
                                            <Link to={{pathname: `/8-way/formation/${letter}`}}
                                                  onClick={clickCallback}
                                                  key={letter}
                                            >
                                                <kbd className="kbd">{letter}</kbd>
                                            </Link>
                                        ))}
                                    </div>
                                </li>
                                <li>
                                    <div className="flex justify-around">
                                        {['17', '18', '19', '20'].map((letter) => (
                                            <Link to={{pathname: `/8-way/formation/${letter}`}}
                                                  onClick={clickCallback}
                                                  key={letter}
                                            >
                                                <kbd className="kbd">{letter}</kbd>
                                            </Link>
                                        ))}
                                    </div>
                                </li>
                                <li>
                                    <div className="flex justify-around">
                                        {['21', '22'].map((letter) => (
                                            <Link to={{pathname: `/8-way/formation/${letter}`}}
                                                  onClick={clickCallback}
                                                  key={letter}
                                            >
                                                <kbd className="kbd">{letter}</kbd>
                                            </Link>
                                        ))}
                                    </div>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <div className="divider"></div>
                        </li>
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
