import type { FlightFormation, Flyer, Score } from '@prisma/client';
import { format } from 'date-fns';
import { CameraSwitchIcon, EditIcon, ScoresIcon } from '~/components/icons';
import { ChangeEvent, MouseEvent, useState } from 'react';
import { calculateScoresPerRound, isRandomFormation } from '~/utils/utils'

type FlightCardProps = {
    flight: {
        id: string
        flyers: Pick<Flyer, 'name'>[];
        formations: Pick<FlightFormation, 'formationId'>[];
        sideVideoUrl: string | null;
        topVideoUrl: string | null;
        scores: Score[]
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
    const [view, setView] = useState<'SIDE' | 'TOP'>('TOP');
    const sideVideoUrl = isLocal ? flight.sideVideoUrl : `https://d3sblpf3xfzlw7.cloudfront.net/${flight.sideVideoUrl?.substring(20)}`
    const topVideoUrl = isLocal ? flight.topVideoUrl : `https://d3sblpf3xfzlw7.cloudfront.net/${flight.topVideoUrl?.substring(20)}`
    const switchCamera = (e: MouseEvent<HTMLButtonElement>) => {
        setView(prevView => prevView === 'SIDE' ? 'TOP' : 'SIDE')
        e.stopPropagation()
        e.preventDefault();
    }
    const [showScores, setShowScores] = useState(false);
    return (
        <div className="card card-compact m-4 max-w-[480px] bg-base-100 shadow-xl">
            <div className="card-actions justify-end">
                {isLocal ?
                    <a href={`/flight/${flight.id}/edit`} className="btn btn-square btn-sm">
                        <EditIcon fill="#FFF" height="16px"/>
                    </a>
                    : null}
                {flight.scores ?
                    <button className="btn btn-sm" onClick={() => setShowScores(prev => !prev)}>
                        <ScoresIcon fill="#FFF" height="16px"/>
                    </button>
                    : null
                }
                {allowSelection ?
                    <input type="checkbox" className="checkbox checkbox-sm mr-2 mt-2 border-white"
                           defaultChecked={isSelected}
                           autoComplete="off" onChange={(event) => onSelect(event, flight.id)}/> : null}
                {flight.sideVideoUrl && flight.topVideoUrl ?
                    <button className="btn btn-sm" onClick={switchCamera}>
                        {view}
                        <CameraSwitchIcon fill="#FFF" height="16px"/>
                    </button>
                    : null
                }
            </div>
            <a href={`/flight/${flight.id}/view`}>
                <figure>
                    {view === 'SIDE' ?
                        <video controls width="480" height="270" muted={true} preload="none" src={`${sideVideoUrl}`}/>
                        :
                        <video controls width="480" height="270" muted={true} preload="none" src={`${topVideoUrl}`}/>
                    }
                </figure>
                <div className="card-body">
                    {showDate ? <span className="card-title text-base-content">
          {format(new Date(session.date), 'do MMMM yyyy')}
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
            {showScores ? <div>
                <Scores scores={flight.scores}
                        formationIds={flight.formations.map(formation => formation.formationId)}/>
            </div> : null}
        </div>
    );
}

function Scores({scores, formationIds}: { scores: Score[], formationIds: string[] }) {
    const scoresPerRound = calculateScoresPerRound(formationIds)
    const rounds = Math.ceil(scores.length / scoresPerRound)
    const rows = []

    function scoreRow(round: number) {
        const rowRows = []
        for (let i = 0; i < scoresPerRound; i++) {
            const idx = round * scoresPerRound + i
            const score = scores[idx]?.score ?? '-'
            rowRows.push(
                <td key={`score-${idx}`} className="border-black border-1">{score}</td>
            )
        }
        return rowRows
    }

    for (let round = 0; round < rounds; round++) {
        rows.push(
            <tr key={`round-${round}`} className="border-black">
                <td>{round + 1}</td>
                {scoreRow(round)}
            </tr>
        )

    }

    return (
        <table className="table table-auto border-1 bg-white">
            <thead>
            <tr className="border-black">
                <th className="border-black">Round</th>
                {formationIds.map((formationId, idx) => (
                        isRandomFormation(formationId) ?
                            <th key={`formation-${idx}`} className="border-black border-1">{formationId}</th>
                            : <>
                                <th className="border-black border-1">{formationId}</th>
                                <th className="border-black border-1">{formationId}</th>
                            </>
                    )
                )}
            </tr>
            </thead>
            <tbody>
            {rows}
            </tbody>
        </table>
    )
}
