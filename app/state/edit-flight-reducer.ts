import { FORMATIONS, isBlock } from '~/data/formations';

export const editFlightReducer = (
    state: EditFlightState,
    action: EditFlightAction,
) => {
    switch (action.type) {
        case 'formElementChange':
            return {
                ...state,
                [action.field]: action.value,
            };
        case 'addRound': {
            const newScores = [...state.scores];
            const round: Score[] = state.formationIds.flatMap((formation) => {
                if (isBlock(FORMATIONS[formation])) {
                    return [
                        { formationId: formation, score: 1, reason: null },
                        { formationId: formation, score: 1, reason: null },
                    ];
                }
                return [{ formationId: formation, score: 1, reason: null }];
            });
            newScores.push(round);
            return {
                ...state,
                scores: newScores,
            };
        }
        case 'removeLastRound':
            return {
                ...state,
                scores: state.scores.slice(0, -1),
            };
        case 'setScore': {
            const newScores = [...state.scores];
            if (action.score != null) {
                newScores[action.roundIdx][action.idx] = {
                    ...state.scores[action.roundIdx][action.idx],
                    score: action.score,
                };
            } else {
                newScores[action.roundIdx] = state.scores[
                    action.roundIdx
                ].slice(0, action.idx);
            }

            return {
                ...state,
                scores: newScores,
            };
        }
        case 'setReason': {
            const newScores = [...state.scores];
            newScores[action.roundIdx][action.idx] = {
                ...state.scores[action.roundIdx][action.idx],
                score: 0,
                reason: action.reason,
            };
            return {
                ...state,
                scores: newScores,
            };
        }
    }
};

export type EditFlightState = {
    formationIds: string[];
    flyers: string;
    date: string;
    scores: Score[][];
};

export type Score = {
    formationId: string;
    score: number;
    reason: string | null;
};

export type EditFlightAction =
    | { type: 'formElementChange'; field: string; value: string }
    | { type: 'addRound'; scoresPerRound: number }
    | { type: 'removeLastRound' }
    | { type: 'setScore'; roundIdx: number; idx: number; score: number | null }
    | {
          type: 'setReason';
          roundIdx: number;
          idx: number;
          reason: string | null;
      };
