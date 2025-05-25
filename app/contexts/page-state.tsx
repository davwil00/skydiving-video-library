import { createContext, Dispatch, ReactNode, useContext, useReducer } from 'react'

type PageState = {
    isFullScreen: boolean;
}

export const initialState: PageState = {
    isFullScreen: false,
};

const PageStateContext = createContext<PageState>(initialState);
const PageStateDispatchContext = createContext<Dispatch<PageStateAction>>(() => {});

export function PageStateProvider({ children }: {children: ReactNode}) {
    const [pageState, dispatch] = useReducer(
        pageStateReducer,
        initialState
    );

    return (
        <PageStateContext.Provider value={pageState}>
            <PageStateDispatchContext.Provider value={dispatch}>
                {children}
            </PageStateDispatchContext.Provider>
        </PageStateContext.Provider>
    );
}

const pageStateReducer = (state: PageState, action: PageStateAction): PageState => {
    switch (action.type) {
        case 'setFullScreen':
            return {
                ...state,
                isFullScreen: action.value
            };
        default:
            return state;
    }
}

type PageStateAction =
    | { type: 'setFullScreen', value: boolean }

export const usePageStateContext = () => useContext(PageStateContext);
export const usePageStateDispatchContext = () => useContext(PageStateDispatchContext);
