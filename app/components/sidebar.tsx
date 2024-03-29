import { Link } from "@remix-run/react";
import { format } from "date-fns";

type Session = { id: string; date: string }
type SidebarProps = {
  sessions: Session[];
};

export default function Sidebar(props: SidebarProps) {
  const { sessions } = props;
  const sessionsByYear = sessions.reduce((groups: { [year: string]: Session[] }, session) => {
    const year = new Date(session.date).getFullYear().toString()
    if (groups[year]) {
      return {
        ...groups,
        [year]: [
          ...groups[year],
          session
        ]
      }
    } else {
      return {
        ...groups,
        [year]: [session]
      }
    }
  }, {})

  return (
    <div className="drawer-side overflow-x-hidden">
      <label htmlFor="drawer-toggle" className="drawer-overlay"></label>
      <ul className="menu min-h-full w-80 bg-base-200 p-4 text-base-content flex-nowrap">
        <li>
          <h2 className="menu-title">Sessions</h2>
          <ul>
            {Object.entries(sessionsByYear).map(([year, sessions], idx) => (
              <div className="collapse" key={`year-${idx}`}>
                <input type="checkbox" />
                <div className="collapse-title">
                  {year}
                </div>
                <div className="collapse-content">
                  {sessions.map((session, idx) => (
                    <li key={`session-${idx}`}>
                      <Link
                        to={{
                          pathname: `/session/${session.id}`
                        }}
                      >
                        {format(new Date(session.date), "dd/MM")}
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
        <li>
          <Link to={{ pathname: '/quiz' }}>Quiz</Link>
        </li>
        <li>
          <div className="divider"></div>
        </li>
        <li className="items-start">
          <h2 className="menu-title">Randoms</h2>
          <ul>
            <li>
              <div className="flex justify-around">
                <Link to={{ pathname: "/formation/A" }}>
                  <kbd className="kbd">A</kbd>
                </Link>
                <Link to={{ pathname: "/formation/B" }}>
                  <kbd className="kbd">B</kbd>
                </Link>
                <Link to={{ pathname: "/formation/C" }}>
                  <kbd className="kbd">C</kbd>
                </Link>
                <Link to={{ pathname: "/formation/D" }}>
                  <kbd className="kbd">D</kbd>
                </Link>
              </div>
            </li>
            <li>
              <div className="flex justify-around">
                <Link to={{ pathname: "/formation/E" }}>
                  <kbd className="kbd">E</kbd>
                </Link>
                <Link to={{ pathname: "/formation/F" }}>
                  <kbd className="kbd">F</kbd>
                </Link>
                <Link to={{ pathname: "/formation/G" }}>
                  <kbd className="kbd">G</kbd>
                </Link>
                <Link to={{ pathname: "/formation/H" }}>
                  <kbd className="kbd">H</kbd>
                </Link>
              </div>
            </li>
            <li>
              <div className="flex justify-around">
                <Link to={{ pathname: "/formation/J" }}>
                  <kbd className="kbd">J</kbd>
                </Link>
                <Link to={{ pathname: "/formation/K" }}>
                  <kbd className="kbd">K</kbd>
                </Link>
                <Link to={{ pathname: "/formation/L" }}>
                  <kbd className="kbd">L</kbd>
                </Link>
                <Link to={{ pathname: "/formation/M" }}>
                  <kbd className="kbd">M</kbd>
                </Link>
              </div>
            </li>
            <li>
              <div className="flex justify-around">
                <Link to={{ pathname: "/formation/N" }}>
                  <kbd className="kbd">N</kbd>
                </Link>
                <Link to={{ pathname: "/formation/O" }}>
                  <kbd className="kbd">O</kbd>
                </Link>
                <Link to={{ pathname: "/formation/P" }}>
                  <kbd className="kbd">P</kbd>
                </Link>
                <Link to={{ pathname: "/formation/Q" }}>
                  <kbd className="kbd">Q</kbd>
                </Link>
              </div>
            </li>
          </ul>
        </li>
        <li>
          <div className="divider"></div>
        </li>
        <li className="items-start">
          <h2 className="menu-title">Blocks</h2>
          <ul>
            <li>
              <div className="flex justify-around">
                <Link to={{ pathname: "/block/2" }}>
                  <kbd className="kbd">2</kbd>
                </Link>
                <Link to={{ pathname: "/block/4" }}>
                  <kbd className="kbd">4</kbd>
                </Link>
                <Link to={{ pathname: "/block/6" }}>
                  <kbd className="kbd">6</kbd>
                </Link>
                <Link to={{ pathname: "/block/7" }}>
                  <kbd className="kbd">7</kbd>
                </Link>
              </div>
            </li>
            <li>
              <div className="flex justify-around">
                <Link to={{ pathname: "/block/8" }}>
                  <kbd className="kbd">8</kbd>
                </Link>
                <Link to={{ pathname: "/block/9" }}>
                  <kbd className="kbd">9</kbd>
                </Link>
                <Link to={{ pathname: "/block/19" }}>
                  <kbd className="kbd">19</kbd>
                </Link>
                <Link to={{ pathname: "/block/21" }}>
                  <kbd className="kbd">21</kbd>
                </Link>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
}
