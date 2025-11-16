import { Session } from '@prisma/client'

export const competitionReducer = (state: EditCompetitionState, action: EditCompetitionAction) => {
    switch (action.type) {
        case 'formElementChange':
            return {
                ...state,
                [action.field]: action.value
            }
        case 'addSession':
            return {
                ...state,
                sessions: new Set([...state.sessions, action.session])
            }
        case 'removeSession': {
            const newSessions = new Set(state.sessions)
            newSessions.delete(action.session)
            return {
                ...state,
                sessions: newSessions,
            }
        }
    }
}


export type EditCompetitionState = {
    startDate: string
    endDate: string
    name: string
    location: string
    rank: number | null
    sessions: Set<SessionIdAndDate>
}

export type EditCompetitionAction =
    | { type: 'formElementChange', field: string, value: string }
    | { type: 'addSession', session: SessionIdAndDate }
    | { type: 'removeSession', session: SessionIdAndDate }

export type SessionIdAndDate = Pick<Session, 'id' | 'date'>