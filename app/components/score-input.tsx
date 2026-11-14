import type { Dispatch } from 'react';
import type { EditFlightAction, Score } from '~/state/edit-flight-reducer';

type Props = {
    key: string;
    idx: string;
    roundIdx: number;
    scoreIdx: number;
    score?: Score;
    dispatch: Dispatch<EditFlightAction>;
};

function getIcon(score?: number) {
    switch (score) {
        case 0:
            return {
                icon: '🔴',
                nextValue: null,
            };
        case 1:
            return {
                icon: '🟢',
                nextValue: 0,
            };
        default:
            return {
                icon: '⚪',
                nextValue: 1,
            };
    }
}

export default function ScoreInput(props: Props) {
    const { dispatch, score, idx, roundIdx, scoreIdx } = props;
    const { icon, nextValue } = getIcon(props.score?.score);
    return (
        <td className="border-black border">
            <div className="flex">
                <button
                    type="button"
                    className="btn btn-xs btn-outline"
                    onClick={() =>
                        dispatch({
                            type: 'setScore',
                            roundIdx,
                            idx: scoreIdx,
                            score: nextValue,
                        })
                    }
                >
                    {icon}
                </button>
                {score?.score === 0 ? (
                    <input
                        type="text"
                        className="input input-xs w-10"
                        maxLength={1}
                        value={score?.reason ?? ''}
                        name={`reason-${idx}-${score.formationId}`}
                        onChange={(e) =>
                            dispatch({
                                type: 'setReason',
                                roundIdx,
                                idx: scoreIdx,
                                reason: e.target.value,
                            })
                        }
                    />
                ) : null}
                {icon ? (
                    <input
                        type="hidden"
                        name={`score-${idx}-${score?.formationId}`}
                        value={score?.score}
                    />
                ) : null}
            </div>
        </td>
    );
}
