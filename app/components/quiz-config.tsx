import { DivePool, QuestionSet, QuizAction, QuizState, QuizType } from '~/state/quiz-reducer'
import React from 'react'

type QuizConfigProps = {
    quizState: QuizState
    dispatch: React.Dispatch<QuizAction>
}

export default function QuizConfig(quizConfigProps: QuizConfigProps) {
    const {quizState, dispatch} = quizConfigProps
    const QuizTypeConfig = () => {
        return (
            <>
                <label>Quiz Type:</label>
                <div className="flex flex-wrap gap-2">
                    <input type="radio"
                           name="quiz-type"
                           className="btn text-white"
                           checked={quizState.quizType === QuizType.PICTURE_TO_NAME}
                           aria-label="Match the picture to the name"
                           autoComplete="off"
                           onChange={() => dispatch({type: 'setQuizType', value: QuizType.PICTURE_TO_NAME})}/>
                    <input type="radio"
                           name="quiz-type"
                           checked={quizState.quizType === QuizType.NAME_TO_PICTURE}
                           className="btn text-white"
                           aria-label="Match the name to the picture"
                           autoComplete="off"
                           onChange={() => dispatch({type: 'setQuizType', value: QuizType.NAME_TO_PICTURE})}/>
                </div>
            </>
        )
    }
    const DivePoolConfig = () => {
        return (
            <>
                <label>Divepool(s)</label>
                <div className="flex gap-2">
                    <input type="checkbox"
                           name="quiz-question-set"
                           className="text-white btn"
                           checked={quizState.divePool?.includes(DivePool.FOUR_WAY)}
                           aria-label="4 Way"
                           autoComplete="off"
                           onChange={() => dispatch({type: 'setDivePool', value: DivePool.FOUR_WAY})}/>
                    <input type="checkbox"
                           name="quiz-question-set"
                           className=" text-white btn"
                           checked={quizState.divePool?.includes(DivePool.EIGHT_WAY)}
                           aria-label="8 Way"
                           autoComplete="off"
                           onChange={() => dispatch({type: 'setDivePool', value: DivePool.EIGHT_WAY})}/>
                </div>
            </>
        )
    }

    const FormationsConfig = () => {
        const makeFormationInput = (label: string, questionSet: QuestionSet) => {
            return (
                <input type="checkbox"
                       name="quiz-question-set"
                       className="text-white btn"
                       checked={quizState.questionSet?.includes(questionSet)}
                       aria-label={label}
                       autoComplete="off"
                       onChange={() => dispatch({type: 'setQuestionSet', value: questionSet})}/>
            )
        }
        const formationOptions = []
        if (quizState.divePool.includes(DivePool.FOUR_WAY)) {
            formationOptions.push(
                {label: "Randoms", questionSet: QuestionSet.RANDOMS},
                {label: "A blocks", questionSet: QuestionSet.BLOCKS_A},
                {label: "AA blocks", questionSet: QuestionSet.BLOCKS_AA},
                {label: "AAA blocks", questionSet: QuestionSet.BLOCKS_AAA},
            )
        }
        if (quizState.divePool.includes(DivePool.EIGHT_WAY)) {
            formationOptions.push(
                {label: "Intermediate Randoms", questionSet: QuestionSet.INTERMEDIATE_RANDOMS},
                {label: "Intermediate Blocks", questionSet: QuestionSet.INTERMEDIATE_BLOCKS},
                {label: "Senior Randoms", questionSet: QuestionSet.SENIOR_RANDOMS},
                {label: "Senior Blocks", questionSet: QuestionSet.SENIOR_BLOCKS},
            )
        }
        return (
            <>
                <label>Formations to include:</label>
                <div className="flex flex-wrap gap-2">
                    {formationOptions.map((option) => makeFormationInput(option.label, option.questionSet))}
                </div>
            </>
        )
    }

    function canStart() {
        return quizState.questionSet.length > 0 && quizState.quizType !== undefined
    }

    return (
        <div className="flex flex-col mx-auto">
            <span className="text-5xl text-black block">Formations Quiz</span>
            <div className="mt-4 flex flex-col gap-4 ">
                <QuizTypeConfig />
                <label>Number of questions</label>
                <div className="flex gap-2">
                    <select className="text-white select"
                           autoComplete="off"
                           onChange={(e) => dispatch({type: 'setNumberOfQuestions', value: parseInt(e.target.value)})}>
                        {[5, 10, 15, 20].map((num) => (
                            <option key={`numberOfQs-${num}`} selected={quizState.numberOfQuestions === num}>{num}</option>
                        ))}
                    </select>
                </div>
                {quizState.quizType != null ? <DivePoolConfig />: null}
                {quizState.divePool != null ? <FormationsConfig />: null}

                <button className="btn text-white mt-4" disabled={!canStart()}
                        onClick={() => dispatch({type: 'startQuiz'})}>Start
                </button>
            </div>
        </div>
    );
}