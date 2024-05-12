import { Link } from "@remix-run/react";
import { format } from "date-fns";
import { RefObject } from "react";

type Session = { id: string; date: string }
type SidebarProps = {
  sessions: Session[];
  isLocal: boolean
  drawerRef: RefObject<HTMLInputElement>
};

export default function Sidebar(props: SidebarProps) {
  const { sessions, isLocal, drawerRef } = props;
  const sessionsByYear = sessions.reduce((groups: { [year: string]: Session[] }, session) => {
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
  }, {});
  const clickCallback = () => drawerRef.current && (drawerRef.current.checked = false);

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
                        onClick={clickCallback}
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
          <Link to={{ pathname: "/quiz" }}
                onClick={clickCallback}>Quiz</Link>
          {isLocal ? <Link to={{ pathname: "/tag" }}
                           onClick={clickCallback}>Tag</Link> : null}
        </li>
        <li>
          <div className="divider"></div>
        </li>
        <li className="items-start">
          <h2 className="menu-title">Randoms</h2>
          <ul>
            <li>
              <div className="flex justify-around">
                {["A", "B", "C", "D"].map((letter) => (
                  <Link to={{ pathname: `/formation/${letter}` }}
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
                {["E", "F", "G", "H"].map((letter) => (
                  <Link to={{ pathname: `/formation/${letter}` }}
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
                {["J", "K", "L", "M"].map((letter) => (
                  <Link to={{ pathname: `/formation/${letter}` }}
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
                {["N", "O", "P", "Q"].map((letter) => (
                  <Link to={{ pathname: `/formation/${letter}` }}
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
          <h2 className="menu-title">Blocks</h2>
          <ul>
            <li>
              <div className="flex justify-around">
                {["2", "4", "6", "7"].map((letter) => (
                  <Link to={{ pathname: `/formation/${letter}` }}
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
                {["8", "9", "19", "21"].map((letter) => (
                  <Link to={{ pathname: `/formation/${letter}` }}
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
      </ul>
    </div>
  );
}
