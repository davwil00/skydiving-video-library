import {
    createContext,
    type Dispatch,
    type ReactNode,
    useContext,
    useReducer,
} from 'react';
import { SiteType } from '~/utils/site-utils';

type LibraryState = {
    siteType: SiteType;
};

export const initialState: LibraryState = {
    siteType: SiteType.COOKIES,
};

const LibraryStateContext = createContext<LibraryState>(initialState);
const LibraryStateDispatchContext = createContext<Dispatch<LibraryStateAction>>(
    () => {},
);

export function LibraryStateProvider({
    siteType,
    children,
}: {
    siteType?: SiteType;
    children: ReactNode;
}) {
    const [libraryState, dispatch] = useReducer(libraryStateReducer, {
        siteType: siteType ?? SiteType.COOKIES,
    });

    return (
        <LibraryStateContext.Provider value={libraryState}>
            <LibraryStateDispatchContext.Provider value={dispatch}>
                {children}
            </LibraryStateDispatchContext.Provider>
        </LibraryStateContext.Provider>
    );
}

const libraryStateReducer = (
    state: LibraryState,
    action: LibraryStateAction,
): LibraryState => {
    switch (action.type) {
        case 'setLibraryState':
            return {
                ...state,
                siteType: action.value,
            };
        default:
            return state;
    }
};

type LibraryStateAction = { type: 'setLibraryState'; value: SiteType };

export const useLibraryStateContext = () => useContext(LibraryStateContext);
export const useLibraryStateDispatchContext = () =>
    useContext(LibraryStateDispatchContext);
