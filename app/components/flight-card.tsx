import type { Flyer, FlightFormation } from "@prisma/client";
import { format } from "date-fns";
import { EditIcon } from "~/components/icons";

type FlightCardProps = {
  flight: {
    id: string
    flyers: Flyer[];
    formations: FlightFormation[];
    videoUrl: string;
  };
  session: { date: string };
  showDate: boolean;
  isLocal: boolean
};

export default function FlightCard(props: FlightCardProps) {
  const { flight, session, showDate, isLocal = false } = props;
  return (
    <div className="card card-compact m-4 max-w-[480px] bg-base-100 shadow-xl">
      {isLocal ?
        <div className="card-actions justify-end">
          <a href={`/flight/${props.flight.id}/edit`} className="btn btn-square btn-sm">
            <EditIcon fill="#FFF" height="16px" />
          </a>
        </div> : null
      }
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
