export type FileToTag = {
  fileName: string
  path: string
  date?: string
  flyers?: string
  formations?: string
  view?: string
}

export type TagAction =
  | { type: "formElementChange", fileName: string, field: keyof FileToTag, value: string }
  | { type: "openVideoPreview", value: string }
  | { type: "closeVideoPreview" }
  | { type: "setOverrideDate", value: string }
  | { type: "setSubmissionState", value?: 'submitting' | 'success' | 'error' }
  | { type: "copy", value: string }

export type TagState = {
  videoPreviewPath?: string
  filesToTag: { [fileName: string]: FileToTag }
  showModal: boolean
  submissionState?: 'submitting' | 'success' | 'error'
}

export const tagReducer = (state: TagState, action: TagAction) => {
  switch (action.type) {
    case "formElementChange":
      return {
        ...state,
        filesToTag: {
          ...state.filesToTag,
          [action.fileName]: {
            ...state.filesToTag[action.fileName],
            [action.field]: action.value
          }
        }
      };
    case "openVideoPreview":
      return {
        ...state,
        showModal: true,
        videoPreviewPath: action.value
      };
    case "closeVideoPreview":
      return {
        ...state,
        showModal: false
      };
    case "setOverrideDate": {
      const newState = { ...state }
      Object.keys(state.filesToTag).forEach(fileName => newState.filesToTag[fileName].date = action.value)
      return newState
    }
    case 'setSubmissionState':
      return {
        ...state,
        submissionState: action.value
      }
    case 'copy': {
      const sourceFile = state.filesToTag[action.value]
      const destFile = action.value.startsWith('source01') ? action.value.replace('source01', 'source02') : action.value.replace('source02', 'source01')
      if (state.filesToTag[destFile]) {
        const newState = { ...state }
        newState.filesToTag[destFile] = {
          ...newState.filesToTag[destFile],
          flyers: sourceFile.flyers,
          formations: sourceFile.formations
        }
        return newState
      }
      return state
    }
    default:
      return state;
  }
};
