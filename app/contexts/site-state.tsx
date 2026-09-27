import {
    createContext,
    type Dispatch,
    type ReactNode,
    useContext,
    useEffect,
    useReducer,
} from 'react';
import { SiteType } from '~/utils/site-utils';

const ALT_COLOURS_STORAGE_KEY = 'altColours';

type SiteState = {
    siteType: SiteType;
    theme: string;
    altColours: boolean;
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
    const [siteState, dispatch] = useReducer(siteStateReducer, {
        siteType: siteType ?? SiteType.COOKIES,
        theme: getTheme(siteType),
        altColours: siteType === SiteType.TUNNEL_VISION,
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
    }, []);

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
        default:
            return state;
    }
};

type SiteStateAction =
    | { type: 'setSiteState'; value: SiteType }
    | { type: 'setAltColours'; value: boolean }
    | { type: 'toggleAltColours' };

export const useSiteStateContext = () => useContext(SiteStateContext);
export const useSiteStateDispatchContext = () =>
    useContext(SiteStateDispatchContext);
