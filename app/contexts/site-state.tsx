import {
    createContext,
    type Dispatch,
    type ReactNode,
    useContext,
    useEffect,
    useReducer,
} from 'react';
import type { Formation } from '~/data/formations';
import { SiteType } from '~/utils/site-utils';

const ALT_COLOURS_STORAGE_KEY = 'altColours';
const QUIZ_STATS_STORAGE_KEY = 'quizStats';

export type QuizFormationStats = {
    correct: number;
    incorrect: number;
};

export type QuizStats = Record<string, QuizFormationStats>;

export function getQuizFormationStatsKey(
    formation: Pick<Formation, 'discipline' | 'id'>,
) {
    return `${formation.discipline}:${formation.id}`;
}

type SiteState = {
    siteType: SiteType;
    theme: string;
    altColours: boolean;
    quizStats: QuizStats;
};

function getTheme(siteType?: SiteType) {
    switch (siteType) {
        case SiteType.TUNNEL_VISION:
            return 'tunnelvision';
        default:
            return 'cookies';
    }
}

export const initialState: SiteState = {
    siteType: SiteType.COOKIES,
    theme: 'cookies',
    altColours: false,
    quizStats: {},
};

const SiteStateContext = createContext<SiteState>(initialState);
const SiteStateDispatchContext = createContext<Dispatch<SiteStateAction>>(
    () => {},
);

export function SiteStateProvider({
    siteType,
    children,
}: {
    siteType?: SiteType;
    children: ReactNode;
}) {
    const activeSiteType = siteType ?? SiteType.COOKIES;
    const [siteState, dispatch] = useReducer(siteStateReducer, {
        siteType: activeSiteType,
        theme: getTheme(activeSiteType),
        altColours: activeSiteType === SiteType.TUNNEL_VISION,
        quizStats: {},
    });

    useEffect(() => {
        const storedAltColours = window.localStorage.getItem(
            ALT_COLOURS_STORAGE_KEY,
        );

        if (storedAltColours) {
            dispatch({
                type: 'setAltColours',
                value: storedAltColours === 'true',
            });
        }
        dispatch({
            type: 'setQuizStats',
            value: loadQuizStats(activeSiteType),
        });
    }, [activeSiteType]);

    return (
        <SiteStateContext.Provider value={siteState}>
            <SiteStateDispatchContext.Provider value={dispatch}>
                {children}
            </SiteStateDispatchContext.Provider>
        </SiteStateContext.Provider>
    );
}

const siteStateReducer = (
    state: SiteState,
    action: SiteStateAction,
): SiteState => {
    switch (action.type) {
        case 'setSiteState':
            return {
                ...state,
                siteType: action.value,
                theme: getTheme(action.value),
            };
        case 'toggleAltColours':
            window.localStorage.setItem(
                ALT_COLOURS_STORAGE_KEY,
                `${!state.altColours}`,
            );
            return {
                ...state,
                altColours: !state.altColours,
            };
        case 'setAltColours':
            return {
                ...state,
                altColours: action.value,
            };
        case 'setQuizStats':
            return {
                ...state,
                quizStats: action.value,
            };
        case 'recordQuizAnswer': {
            const key = getQuizFormationStatsKey(action.formation);
            const currentStats = state.quizStats[key] ?? {
                correct: 0,
                incorrect: 0,
            };
            const updatedFormationStats = action.isCorrect
                ? { ...currentStats, correct: currentStats.correct + 1 }
                : {
                      ...currentStats,
                      incorrect: currentStats.incorrect + 1,
                  };
            const quizStats = {
                ...state.quizStats,
                [key]: updatedFormationStats,
            };
            saveQuizStats(state.siteType, quizStats);

            return {
                ...state,
                quizStats,
            };
        }
        default:
            return state;
    }
};

type SiteStateAction =
    | { type: 'setSiteState'; value: SiteType }
    | { type: 'setAltColours'; value: boolean }
    | { type: 'setQuizStats'; value: QuizStats }
    | {
          type: 'recordQuizAnswer';
          formation: Pick<Formation, 'discipline' | 'id'>;
          isCorrect: boolean;
      }
    | { type: 'toggleAltColours' };

export const useSiteStateContext = () => useContext(SiteStateContext);
export const useSiteStateDispatchContext = () =>
    useContext(SiteStateDispatchContext);
