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
    | { type: 'copy'; value: string };

export type TagState = {
    videoPreviewPath?: string;
    filesToTag: Map<string, FileToTag>;
    showModal: boolean;
    submissionState?: 'submitting' | 'success' | 'error';
};

export const tagReducer = (state: TagState, action: TagAction) => {
    switch (action.type) {
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
        default:
            return state;
    }
};
