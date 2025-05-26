import type { FlightFormation, Flyer } from '@prisma/client';
import { format } from 'date-fns';
import { CameraSwitchIcon, EditIcon } from '~/components/icons';
import { ChangeEvent, MouseEvent, useState } from 'react';

type FlightCardProps = {
  flight: {
    id: string
    flyers: Pick<Flyer, 'name'>[];
    formations: Pick<FlightFormation, 'formationId'>[];
    sideVideoUrl: string | null;
    topVideoUrl: string | null;
  };
  session: { date: Date };
  showDate: boolean;
  isLocal?: boolean;
  allowSelection?: boolean;
  onSelect?: (event: ChangeEvent<HTMLInputElement>, flightId: string) => void
  isSelected?: boolean;
};

export default function FlightCard(props: FlightCardProps) {
  const {
    flight, session, showDate, isLocal = false, allowSelection = false, onSelect = () => {
    }, isSelected = false
  } = props;
  const [view, setView] = useState<'SIDE'|'TOP'>('TOP');
  const sideVideoUrl = isLocal ? flight.sideVideoUrl: `https://d3sblpf3xfzlw7.cloudfront.net/${flight.sideVideoUrl?.substring(20)}`
  const topVideoUrl = isLocal ? flight.topVideoUrl : `https://d3sblpf3xfzlw7.cloudfront.net/${flight.topVideoUrl?.substring(20)}`
  const switchCamera = (e: MouseEvent<HTMLButtonElement>) => {
    setView(prevView => prevView === 'SIDE' ? 'TOP' : 'SIDE')
    e.stopPropagation()
    e.preventDefault();
  }
  return (
    <a className="card card-compact m-4 max-w-[480px] bg-base-100 shadow-xl" href={`/flight/${flight.id}/view`}>
      <div className="card-actions justify-end">
        {isLocal ?
          <a href={`/flight/${flight.id}/edit`} className="btn btn-square btn-sm">
            <EditIcon fill="#FFF" height="16px" />
          </a>
          : null}
        {allowSelection ?
          <input type="checkbox" className="checkbox checkbox-sm mr-2 mt-2 border-white" defaultChecked={isSelected}
                 autoComplete="off" onChange={(event) => onSelect(event, flight.id)} /> : null}
        {flight.sideVideoUrl && flight.topVideoUrl ?
            <button className="btn btn-sm" onClick={switchCamera}>
              {view}
              <CameraSwitchIcon fill="#FFF" height="16px" />
            </button>
            : null
        }
      </div>
      <figure>
        {view === 'SIDE' ?
            <video controls width="480" height="270" muted={true} preload="none" src={`${sideVideoUrl}`}/>
            :
            <video controls width="480" height="270" muted={true} preload="none" src={`${topVideoUrl}`}/>
        }
      </figure>
      <div className="card-body">
        {showDate ? <span className="card-title text-base-content">
          {format(new Date(session.date), "do MMMM yyyy")}
        </span> : null}
        <div className="card-action flex items-center justify-between">
          <div>
            {flight.formations.map((formation, formationIdx) => (
              <kbd key={formationIdx} className="kbd m-1 text-white">
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
    </a>
  );
}
