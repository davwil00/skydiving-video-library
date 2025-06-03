import { createContext, Dispatch, ReactNode, useContext, useReducer } from 'react'
export enum LibraryType { TEAM = 'Team', SOLO = "Solo", FS_NIGHT = "FS Night" }

type LibraryState = {
    libraryType: LibraryType;
    canSwitch: boolean
}

export const initialState: LibraryState = {
    libraryType: LibraryType.TEAM,
    canSwitch: true,
};

const LibraryStateContext = createContext<LibraryState>(initialState);
const LibraryStateDispatchContext = createContext<Dispatch<LibraryStateAction>>(() => {});

export function LibraryStateProvider({ hostName, children }: {hostName?: string, children: ReactNode}) {
    const canSwitch = hostName?.includes('solo') || false
    const [libraryState, dispatch] = useReducer(
        libraryStateReducer,
        {...initialState, canSwitch}
    );

    return (
        <LibraryStateContext.Provider value={libraryState}>
            <LibraryStateDispatchContext.Provider value={dispatch}>
                {children}
            </LibraryStateDispatchContext.Provider>
        </LibraryStateContext.Provider>
    );
}

const libraryStateReducer = (state: LibraryState, action: LibraryStateAction): LibraryState => {
    switch (action.type) {
        case 'setLibraryState':
            return {
                ...state,
                libraryType: action.value
            };
        default:
            return state;
    }
}

type LibraryStateAction =
    | { type: 'setLibraryState', value: LibraryType }

export const useLibraryStateContext = () => useContext(LibraryStateContext);
export const useLibraryStateDispatchContext = () => useContext(LibraryStateDispatchContext);
