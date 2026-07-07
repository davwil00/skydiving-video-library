export type FileToTag = {
    id: string;
    sideVideoFileName?: string;
    sideVideoPath?: string;
    topVideoFileName?: string;
    topVideoPath?: string;
    date?: string;
    flyers?: string;
    formations?: string;
};

export type TagAction =
    | {
          type: 'formElementChange';
          id: string;
          field: keyof FileToTag;
          value: string;
      }
    | { type: 'openVideoPreview'; value: string }
    | { type: 'closeVideoPreview' }
    | { type: 'setOverrideDate'; value: string }
    | { type: 'setSubmissionState'; value?: 'submitting' | 'success' | 'error' }
    | { type: 'resetProgress' }
    | { type: 'setProgressStart'; total: number }
    | {
          type: 'setProgressUpdate';
          completed: string[];
          total: number;
          currentFile: string;
      }
    | { type: 'addProgressError'; message: string }
    | { type: 'setProgressDone'; completed: string[]; total: number }
    | { type: 'trackFile'; value: FileToTag }
    | { type: 'setError'; value: string }
    | { type: 'copy'; value: string };

export type TagState = {
    videoPreviewPath?: string;
    filesToTag: Map<string, FileToTag>;
    showModal: boolean;
    submissionState?: 'submitting' | 'success' | 'error';
    error?: string;
    progressTotal: number;
    progressCompleted: string[];
    progressCurrentFile?: string;
    progressErrors: string[];
};

export const tagReducer = (state: TagState, action: TagAction) => {
    switch (action.type) {
        case 'trackFile': {
            if (state.filesToTag.has(action.value.id)) {
                return state;
            }
            const filesToTag = new Map(state.filesToTag);
            filesToTag.set(action.value.id, action.value);
            return {
                ...state,
                filesToTag,
            };
        }
        case 'formElementChange':
            state.filesToTag.set(action.id, {
                // biome-ignore lint/style/noNonNullAssertion: will always be there
                ...state.filesToTag.get(action.id)!,
                [action.field]: action.value,
            });
            return { ...state };
        case 'openVideoPreview':
            return {
                ...state,
                showModal: true,
                videoPreviewPath: action.value,
            };
        case 'closeVideoPreview':
            return {
                ...state,
                showModal: false,
            };
        case 'setOverrideDate': {
            state.filesToTag.forEach((file: FileToTag) => {
                file.date = action.value;
            });
            return { ...state };
        }
        case 'setSubmissionState':
            return {
                ...state,
                submissionState: action.value,
            };
        case 'setError':
            return {
                ...state,
                error: action.value,
            };
        case 'resetProgress':
            return {
                ...state,
                progressTotal: 0,
                progressCompleted: [],
                progressCurrentFile: undefined,
                progressErrors: [],
            };
        case 'setProgressStart':
            return {
                ...state,
                progressTotal: action.total,
                progressCompleted: [],
                progressCurrentFile: undefined,
                progressErrors: [],
            };
        case 'setProgressUpdate':
            return {
                ...state,
                progressCompleted: action.completed,
                progressTotal: action.total,
                progressCurrentFile: action.currentFile,
            };
        case 'addProgressError':
            return {
                ...state,
                progressErrors: [...state.progressErrors, action.message],
            };
        case 'setProgressDone':
            return {
                ...state,
                progressCompleted: action.completed,
                progressTotal: action.total,
                progressCurrentFile: undefined,
            };
        default:
            return state;
    }
};
