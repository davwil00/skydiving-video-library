import type { Flyer, FlightFormation } from "@prisma/client";
import { format } from "date-fns";
import { EditIcon } from "~/components/icons";
import { ChangeEvent } from "react";

type FlightCardProps = {
  flight: {
    id: string
    flyers: Flyer[];
    formations: FlightFormation[];
    videoUrl: string;
  };
  session: { date: string };
  showDate: boolean;
  isLocal?: boolean;
  allowSelection?: boolean;
  onSelect?: (event: ChangeEvent<HTMLInputElement>, flightId: string) => void
  isSelected?: boolean;
};

export default function FlightCard(props: FlightCardProps) {
  const { flight, session, showDate, isLocal = false,  allowSelection = false, onSelect = () => {}, isSelected = false } = props;
  return (
    <div className="card card-compact m-4 max-w-[480px] bg-base-100 shadow-xl">
      <div className="card-actions justify-end">
        {isLocal ?
          <a href={`/flight/${flight.id}/edit`} className="btn btn-square btn-sm">
            <EditIcon fill="#FFF" height="16px" />
          </a>
          : null}
        {allowSelection ? <input type="checkbox" className="checkbox checkbox-sm mr-2 mt-2 border-white" defaultChecked={isSelected} autoComplete="off" onChange={(event) => onSelect(event, flight.id)}/> : null }
      </div>
      <figure>
        <video controls width="480" muted={true} preload="none">
          <source src={`${flight.videoUrl}`} />
        </video>
      </figure>
      <div className="card-body">
        {showDate && (
          <span className="card-title">
            {format(new Date(session.date), "do MMMM")}
          </span>
        )}
        <div className="card-action flex items-center justify-between">
          <div>
            {flight.formations.map((formation, formationIdx) => (
              <kbd key={formationIdx} className="kbd m-1">
                {formation.formationId}
              </kbd>
            ))}
          </div>
          <div className="text-right">
            {flight.flyers.map((flyer, flyerIdx) => (
              <div key={flyerIdx} className="badge badge-primary m-1">
                {flyer.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
