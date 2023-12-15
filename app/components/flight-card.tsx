import type { Flyer, Formation, Blocks } from "@prisma/client";
import { format } from "date-fns";

type FlightCardProps = {
  flight: {
    flyers: Flyer[];
    formations: Formation[];
    blocks: Blocks[];
    videoUrl: string;
  };
  session: { date: string };
  showDate: boolean;
};

export default function FlightCard(props: FlightCardProps) {
  const { flight, session, showDate } = props;
  const flightsAndFormations = flight.formations
    .map(formation => formation.letter)
    .concat(flight.blocks.map(block => block.id.toString()))
  return (
    <div className="card card-compact m-4 max-w-[480px] max-h-[350px] bg-base-100 shadow-xl">
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
            {flightsAndFormations.map((formation, formationIdx) => (
              <kbd key={formationIdx} className="kbd m-1">
                {formation}
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
