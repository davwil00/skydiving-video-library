import {
    A_BLOCKS,
    AA_BLOCKS,
    AAA_BLOCKS,
    allFormations,
    EIGHT_WAY_BLOCKS,
    EIGHT_WAY_RANDOMS,
    type Formation,
    Level,
    RANDOMS
} from '~/data/formations';
import { shuffle } from '~/utils/utils';

export type QuizAction =
    | { type: 'startQuiz' }
    | { type: 'reset' }
    | { type: 'nextQuestion' }
    | { type: 'answerQuestion', answer: Formation, isCorrect: boolean }
    | { type: 'setQuestionSet', value: QuestionSet }
    | { type: 'setQuizType', value: QuizType }
    | { type: 'setDivePool', value: DivePool }
    | { type: 'setNumberOfQuestions', value: number }


export type Question = {
    answer: Formation
    choices: Formation[]
}

export enum QuizType {
    NAME_TO_PICTURE,
    PICTURE_TO_NAME
}

export enum DivePool {
    FOUR_WAY,
    EIGHT_WAY
}

export enum QuestionSet {
    RANDOMS,
    BLOCKS_A,
    BLOCKS_AA,
    BLOCKS_AAA,
    INTERMEDIATE_RANDOMS,
    INTERMEDIATE_BLOCKS,
    SENIOR_RANDOMS,
    SENIOR_BLOCKS,
}

export type QuizState = {
    started: boolean
    questionNo: number
    score: number
    questions: Question[]
    selectedAnswer?: Formation
    quizType?: QuizType
    questionSet: QuestionSet[]
    divePool: DivePool[]
    numberOfQuestions: number
}

export const initialState: QuizState = {
    started: false,
    questionNo: 0,
    score: 0,
    questions: [],
    selectedAnswer: undefined,
    quizType: undefined,
    questionSet: [],
    divePool: [],
    numberOfQuestions: 10
}

export const quizReducer = (state: QuizState, action: QuizAction): QuizState => {
    switch (action.type) {
        case 'startQuiz':
            return {
                ...initialState,
                questionNo: 0,
                quizType: state.quizType,
                questionSet: state.questionSet,
                started: true,
                questions: generateQuestions(state.questionSet, state.numberOfQuestions)
            }

        case 'reset':
            return {
                ...initialState
            }

        case 'nextQuestion':
            return {
                ...state,
                questionNo: state.questionNo + 1,
                selectedAnswer: undefined
            }

        case 'setQuestionSet':
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

        case 'setDivePool':
            if (state.divePool.includes(action.value)) {
                return {
                    ...state,
                    divePool: state.divePool.filter(divePool => divePool !== action.value)
                }
            }
            return {
                ...state,
                divePool: [...state.divePool, action.value]
            }

        case 'setQuizType':
            return {
                ...state,
                quizType: action.value,
            }

        case 'answerQuestion':
            return {
                ...state,
                score: action.isCorrect ? state.score + 1 : state.score,
                selectedAnswer: action.answer,
            }


        default:
            return state
    }
}

function generateQuestions(questionSet: QuestionSet[], numberOfQuestions: number): Question[] {
    const formationsToInclude = [
        ...(questionSet.includes(QuestionSet.RANDOMS) ? RANDOMS : []),
        ...(questionSet.includes(QuestionSet.BLOCKS_A) ? A_BLOCKS : []),
        ...(questionSet.includes(QuestionSet.BLOCKS_AA) ? AA_BLOCKS : []),
        ...(questionSet.includes(QuestionSet.BLOCKS_AAA) ? AAA_BLOCKS : []),
        ...(questionSet.includes(QuestionSet.INTERMEDIATE_RANDOMS) ? EIGHT_WAY_RANDOMS.filter(formation  => formation.level === Level.INTERMEDIATE) : []),
        ...(questionSet.includes(QuestionSet.INTERMEDIATE_BLOCKS) ? EIGHT_WAY_BLOCKS.filter(formation  => formation.level === Level.INTERMEDIATE) : []),
        ...(questionSet.includes(QuestionSet.SENIOR_RANDOMS) ? EIGHT_WAY_RANDOMS.filter(formation  => formation.level === Level.SENIOR) : []),
        ...(questionSet.includes(QuestionSet.SENIOR_BLOCKS) ? EIGHT_WAY_BLOCKS.filter(formation  => formation.level === Level.SENIOR) : []),
    ]
    const numberOfQuestionsToGenerate = formationsToInclude.length > numberOfQuestions ? numberOfQuestions : formationsToInclude.length
    shuffle(formationsToInclude);
    return formationsToInclude.slice(0, numberOfQuestionsToGenerate).map(formation => ({
        answer: formation,
        choices: generateMultipleChoiceAnswers(formation)
    }));
}

function generateMultipleChoiceAnswers(actualAnswer: Formation): Formation[] {
    const possibleAlternateAnswers: Formation[] = allFormations.filter(formation =>
        formation.level === actualAnswer.level &&
        formation.discipline === actualAnswer.discipline &&
        formation !== actualAnswer
    )
    const answers = possibleAlternateAnswers.slice(0, 3).concat(actualAnswer)
    shuffle(answers)
    return answers
}
