import {
    allFormations,
    type Discipline,
    type Formation,
    type Level,
    type Type,
} from '~/data/formations';
import { shuffle } from '~/utils/utils';

export type QuizAction =
    | { type: 'startQuiz' }
    | { type: 'reset' }
    | { type: 'nextQuestion' }
    | { type: 'answerQuestion'; answer: Formation | Slot; isCorrect: boolean }
    | { type: 'setQuestionSet'; value: QuestionSet }
    | { type: 'setQuizType'; value: QuizType }
    | { type: 'setDivePool'; value: DivePool }
    | { type: 'setNumberOfQuestions'; value: number }
    | { type: 'setSlot'; value: Slot }
    | { type: 'setDifficulty'; value: Difficulty };

export type FormationQuestion = {
    answer: Formation;
    choices: Formation[];
};
export type SlotQuestion = {
    formation: Formation;
    slotToIdentify: Slot;
};

export enum QuizType {
    NAME_TO_PICTURE,
    PICTURE_TO_NAME,
    FIND_YOUR_SLOT,
}

export enum DivePool {
    FOUR_WAY,
    EIGHT_WAY,
}

export enum Difficulty {
    EASY,
    HARD,
}

export class QuestionSet {
    constructor(
        public discipline: Discipline,
        public level: Level,
        public type: Type,
    ) {}

    equals(questionSet: QuestionSet): boolean {
        return (
            this.discipline === questionSet.discipline &&
            this.level === questionSet.level &&
            this.type === questionSet.type
        );
    }
}

export function containsQuestionSet(
    questionSets: QuestionSet[],
    questionSet: QuestionSet,
): boolean {
    return questionSets.find((qs) => qs.equals(questionSet)) !== undefined;
}

export const slots: Slot[] = [
    { name: 'Inside Front', className: 'IF', divePools: [DivePool.EIGHT_WAY] },
    { name: 'Outside Front', className: 'OF', divePools: [DivePool.EIGHT_WAY] },
    { name: 'Inside Rear', className: 'IR', divePools: [DivePool.EIGHT_WAY] },
    { name: 'Outside Rear', className: 'OR', divePools: [DivePool.EIGHT_WAY] },
    {
        name: 'Point',
        className: 'P',
        divePools: [DivePool.FOUR_WAY, DivePool.EIGHT_WAY],
    },
    {
        name: 'Inside Centre',
        className: 'IC',
        divePools: [DivePool.FOUR_WAY, DivePool.EIGHT_WAY],
    },
    {
        name: 'Outside Centre',
        className: 'OC',
        divePools: [DivePool.FOUR_WAY, DivePool.EIGHT_WAY],
    },
    {
        name: 'Tail',
        className: 'T',
        divePools: [DivePool.FOUR_WAY, DivePool.EIGHT_WAY],
    },
];

export type Slot = {
    name: string;
    className: string;
    divePools: DivePool[];
};

export type QuizState = {
    started: boolean;
    questionNo: number;
    score: number;
    questions: FormationQuestion[] | SlotQuestion[];
    selectedAnswer?: Formation | Slot;
    quizType?: QuizType;
    questionSets: QuestionSet[];
    divePool: DivePool[];
    numberOfQuestions: number;
    slots: Slot[];
    difficulty?: Difficulty;
};

export const initialState: QuizState = {
    started: false,
    questionNo: 0,
    score: 0,
    questions: [],
    selectedAnswer: undefined,
    quizType: undefined,
    questionSets: [],
    divePool: [],
    numberOfQuestions: 10,
    slots: [],
    difficulty: undefined,
};

export const quizReducer = (
    state: QuizState,
    action: QuizAction,
): QuizState => {
    switch (action.type) {
        case 'startQuiz':
            return {
                ...initialState,
                questionNo: 0,
                quizType: state.quizType,
                questionSets: state.questionSets,
                slots: state.slots,
                divePool: state.divePool,
                started: true,
                questions:
                    state.quizType === QuizType.FIND_YOUR_SLOT
                        ? generateSlotQuestions(
                              state.slots,
                              state.questionSets,
                              state.numberOfQuestions,
                          )
                        : generateFormationQuestions(
                              state.questionSets,
                              state.numberOfQuestions,
                          ),
            };

        case 'reset':
            return {
                ...initialState,
            };

        case 'nextQuestion':
            return {
                ...state,
                questionNo: state.questionNo + 1,
                selectedAnswer: undefined,
            };

        case 'setQuestionSet':
            if (containsQuestionSet(state.questionSets, action.value)) {
                return {
                    ...state,
                    questionSets: state.questionSets.filter(
                        (questionSet) => !questionSet.equals(action.value),
                    ),
                };
            }
            return {
                ...state,
                questionSets: [...state.questionSets, action.value],
            };

        case 'setDivePool':
            if (state.divePool.includes(action.value)) {
                return {
                    ...state,
                    divePool: state.divePool.filter(
                        (divePool) => divePool !== action.value,
                    ),
                };
            }
            return {
                ...state,
                divePool: [...state.divePool, action.value],
            };

        case 'setSlot':
            if (state.slots.includes(action.value)) {
                return {
                    ...state,
                    slots: state.slots.filter((slot) => slot !== action.value),
                };
            }
            return {
                ...state,
                slots: [...state.slots, action.value],
            };

        case 'setQuizType':
            return {
                ...state,
                quizType: action.value,
            };

        case 'setDifficulty':
            return {
                ...state,
                difficulty: action.value,
            };

        case 'answerQuestion':
            return {
                ...state,
                score: action.isCorrect ? state.score + 1 : state.score,
                selectedAnswer: action.answer,
            };

        case 'setNumberOfQuestions':
            return {
                ...state,
                numberOfQuestions: action.value,
            };

        default:
            return state;
    }
};

function getFormationsToIncludeFromQuestionSets(
    questionSets: QuestionSet[],
): Formation[] {
    const formationsToInclude = allFormations.filter((formation) =>
        questionSets.some(
            (questionSet) =>
                formation.discipline === questionSet.discipline &&
                formation.level === questionSet.level &&
                formation.type === questionSet.type,
        ),
    );
    shuffle(formationsToInclude);
    return formationsToInclude;
}

function generateFormationQuestions(
    questionSets: QuestionSet[],
    numberOfQuestions: number,
): FormationQuestion[] {
    const formationsToInclude =
        getFormationsToIncludeFromQuestionSets(questionSets);
    const numberOfQuestionsToGenerate =
        formationsToInclude.length > numberOfQuestions
            ? numberOfQuestions
            : formationsToInclude.length;
    return formationsToInclude
        .slice(0, numberOfQuestionsToGenerate)
        .map((formation) => ({
            answer: formation,
            choices: generateMultipleChoiceAnswers(formation),
        }));
}

function generateSlotQuestions(
    slots: Slot[],
    questionSets: QuestionSet[],
    numberOfQuestions: number,
): SlotQuestion[] {
    const slotsToInclude = [...slots];
    const formationsToInclude =
        getFormationsToIncludeFromQuestionSets(questionSets);
    const numberOfQuestionsToGenerate =
        formationsToInclude.length > numberOfQuestions
            ? numberOfQuestions
            : formationsToInclude.length;
    return formationsToInclude
        .slice(0, numberOfQuestionsToGenerate)
        .map((formation) => {
            shuffle(slotsToInclude);
            const slotToIdentify = slotsToInclude[0];
            return {
                formation,
                slotToIdentify,
            };
        });
}

function generateMultipleChoiceAnswers(actualAnswer: Formation): Formation[] {
    const possibleAlternateAnswers: Formation[] = allFormations.filter(
        (formation) =>
            formation.level === actualAnswer.level &&
            formation.discipline === actualAnswer.discipline &&
            formation.type === actualAnswer.type &&
            formation !== actualAnswer,
    );
    const answers = possibleAlternateAnswers.slice(0, 3).concat(actualAnswer);
    shuffle(answers);
    return answers;
}
