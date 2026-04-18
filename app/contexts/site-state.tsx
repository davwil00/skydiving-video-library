import {
    createContext,
    type Dispatch,
    type ReactNode,
    useContext,
    useReducer,
} from 'react';
import { SiteType } from '~/utils/site-utils';

type SiteState = {
    siteType: SiteType;
    theme: string;
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
    });

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
        default:
            return state;
    }
};

type SiteStateAction = { type: 'setSiteState'; value: SiteType };

export const useSiteStateContext = () => useContext(SiteStateContext);
export const useSiteStateDispatchContext = () =>
    useContext(SiteStateDispatchContext);
