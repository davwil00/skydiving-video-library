import { Link } from "@remix-run/react";
import { format } from "date-fns";

type SidebarProps = {
  sessions: { id: string; date: string }[];
};

export default function Sidebar(props: SidebarProps) {
  const { sessions } = props;

  return (
    <div className="drawer-side">
      <ul className="menu h-full w-80 bg-base-200 p-4 text-base-content">
        <li>
          <h2 className="menu-title">Sessions</h2>
          <ul>
            {sessions.map((session, idx) => (
              <li key={idx}>
                <Link
                  to={{
                    pathname: `/session/${session.id}`,
                  }}
                >
                  {format(new Date(session.date), "dd/MM")}
                </Link>
              </li>
            ))}
          </ul>
        </li>
        <li>
          <div className="divider"></div>
        </li>
        <li>
          <h2 className="menu-title">Randoms</h2>
          <ul>
            <li>
              <div className="flex justify-between">
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
              <div className="flex justify-between">
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
              <div className="flex justify-between">
                <Link to={{ pathname: "/formation/I" }}>
                  <kbd className="kbd">I</kbd>
                </Link>
                <Link to={{ pathname: "/formation/J" }}>
                  <kbd className="kbd">J</kbd>
                </Link>
                <Link to={{ pathname: "/formation/K" }}>
                  <kbd className="kbd">K</kbd>
                </Link>
                <Link to={{ pathname: "/formation/L" }}>
                  <kbd className="kbd">L</kbd>
                </Link>
              </div>
            </li>
            <li>
              <div className="flex justify-between">
                <Link to={{ pathname: "/formation/M" }}>
                  <kbd className="kbd">M</kbd>
                </Link>
                <Link to={{ pathname: "/formation/N" }}>
                  <kbd className="kbd">N</kbd>
                </Link>
                <Link to={{ pathname: "/formation/O" }}>
                  <kbd className="kbd">O</kbd>
                </Link>
                <Link to={{ pathname: "/formation/P" }}>
                  <kbd className="kbd">P</kbd>
                </Link>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
}
