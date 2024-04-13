import { type Formation, A_BLOCKS, RANDOMS } from "~/data/formations";

export type QuizAction =
  | { type: "startQuiz" }
  | { type: "reset" }
  | { type: "nextQuestion" }
  | { type: "answerQuestion" , answer: Formation, isCorrect: boolean}
  | { type: "setQuestionSet", value: QuestionSet }
  | { type: "setQuizType", value: QuizType }


export type Question = {
  answer: Formation
  choices: Formation[]
}

export enum QuizType {
  NAME_TO_PICTURE,
  PICTURE_TO_NAME
}

export enum QuestionSet {
  RANDOMS,
  BLOCKS_A
}

export type QuizState = {
  started: boolean
  questionNo: number
  score: number
  questions: Question[]
  selectedAnswer?: Formation
  quizType?: QuizType
  questionSet: QuestionSet[]
}

export const initialState: QuizState = {
  started: false,
  questionNo: 0,
  score: 0,
  questions: [],
  selectedAnswer: undefined,
  quizType: undefined,
  questionSet: []
}

export const quizReducer = (state: QuizState, action: QuizAction): QuizState => {
  switch (action.type) {
    case "startQuiz":
      return {
        ...initialState,
        quizType: state.quizType,
        started: true,
        questions: generateQuestions(state.questionSet)
      }

    case "reset":
      return {
        ...initialState
      }

    case "nextQuestion":
      return {
        ...state,
        questionNo: state.questionNo + 1,
        selectedAnswer: undefined
      }

    case "setQuestionSet":
      if (state.questionSet.includes(action.value)) {
        return {
          ...state,
          questionSet: state.questionSet.filter(questionSet => questionSet !== action.value)
        }
      }
      return {
        ...state,
        questionSet: [...state.questionSet, action.value]
      }

    case "setQuizType":
      return {
        ...state,
        quizType: action.value,
      }

    case "answerQuestion":
      return {
        ...state,
        score: action.isCorrect ? state.score + 1 : state.score,
        selectedAnswer: action.answer,
      }

    default:
      return state
  }
}


function generateQuestions(questionSet: QuestionSet[]): Question[] {
  const formationsToInclude = [
    ...(questionSet.includes(QuestionSet.RANDOMS) ? RANDOMS : []),
    ...(questionSet.includes(QuestionSet.BLOCKS_A) ? A_BLOCKS : []),
  ]
  shuffle(formationsToInclude);
  return formationsToInclude.slice(0, 10).map(formation => ({
    answer: formation,
    choices: generateMultipleChoiceAnswers(formation, [...formationsToInclude])
  }));
}

function generateMultipleChoiceAnswers(actualAnswer: Formation, formationsToInclude: Formation[]): Formation[] {
  const actualAnswerIdx = formationsToInclude.indexOf(actualAnswer);
  formationsToInclude.splice(actualAnswerIdx, 1);
  shuffle(formationsToInclude);
  const answers = formationsToInclude.slice(0, 3).concat(actualAnswer);
  shuffle(answers);
  return answers;
}

// From https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array#answer-25984542
function shuffle(a: any[], b?: number, c?: number, d?: string) {
  c = a.length;
  while (c) {
    b = Math.random() * (--c + 1) | 0;
    d = a[c];
    a[c] = a[b];
    a[b] = d;
  }
}
