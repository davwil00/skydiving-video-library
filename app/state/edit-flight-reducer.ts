export const editFlightReducer = (state: EditFlightState, action: EditFlightAction) => {
    switch (action.type) {
        case 'formElementChange':
            return {
                ...state,
                [action.field]: action.value
            }
        case 'addRound': {
            const newScores = [...state.scores]
            for (let i = 0; i < action.scoresPerRound; i++) {
                newScores.push(1)
            }
            return {
                ...state,
                rounds: state.rounds + 1,
                scores: newScores
            }
        }
        case 'removeLastRound':
            return {
                ...state,
                rounds: state.rounds - 1
            }
        case 'setScore': {
            let newScores
            if (action.score !== null) {
                newScores = [...state.scores]
                newScores[action.idx] = action.score
            } else {
                newScores = state.scores.slice(0, action.idx)
            }
            return {
                ...state,
                scores: newScores
            }
        }
    }
}


export type EditFlightState = {
    formations: string,
    flyers: string,
    date: string,
    rounds: number,
    scores: number[]
}

export type EditFlightAction =
    | { type: 'formElementChange', field: string, value: string }
    | { type: 'addRound', scoresPerRound: number }
    | { type: 'removeLastRound' }
    | { type: 'setScore', idx: number, score: number | null }
