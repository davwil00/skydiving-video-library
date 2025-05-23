import { useEffect, useReducer, useRef } from 'react';
import { CheckIcon, XIcon } from '~/components/icons';
import { getFormationImageUrl } from '~/utils/utils';
import { initialState, type Question, QuestionSet, quizReducer, QuizType } from '~/state/quiz-reducer';
import { type Formation, isRandom } from '~/data/formations';

export default function QuizPage() {
    const [quizState, dispatch] = useReducer(quizReducer, initialState)
    const questionNoRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        window.scrollTo(0, document.body.scrollHeight)
    }, [quizState.selectedAnswer])

    useEffect(() => {
        questionNoRef?.current?.scrollIntoView()
    }, [quizState.questionNo])

    const checkAnswer = (selectedAnswer: Formation, actualAnswer: Formation) => {
        const isCorrect = selectedAnswer === actualAnswer;
        dispatch({type: 'answerQuestion', answer: selectedAnswer, isCorrect})
    };

    function gameEnd() {
        return (
            <div className="">
                <p className="text-center text-5xl text-black">You
                    scored {quizState.score}/{quizState.questions.length}</p>
                <div className="text-center mt-8">
                    <button className="btn text-white" onClick={() => dispatch({type: 'reset'})}>Play again</button>
                </div>
            </div>
        );
    }

    function imageRow(choices: Formation[], answer: Formation) {
        const disabled = !!quizState.selectedAnswer
        return (
            <div className="flex justify-center gap-3 mb-3">
                {choices.map((choice, idx) =>
                    <button type="button" key={idx} className={quizState.selectedAnswer ?
                        quizState.selectedAnswer === choice ? 'ring-primary ring-offset-1 ring-4' :
                            answer === choice ? 'ring-success ring-offset-1 ring-4' : ''
                        : ''}
                            onClick={() => !disabled && checkAnswer(choice, answer)}
                            onKeyUp={(e) => !disabled && e.key === 'Enter' ? checkAnswer(choice, answer) : {}}
                    >
                        <img
                            key={idx}
                            className={`w-max max-h-[calc(50vh-35px)] mx-auto`}
                            alt="skydiving formation"
                            src={getFormationImageUrl(choice)}
                        />
                    </button>
                )}
            </div>
        )
    }

    function identifyPictureFromFormation(currentQuestion: Question) {
        return (
            <div className="card text-black">
                <div className="justify-between flex mb-4">
                    <div>Question {quizState.questionNo + 1}</div>
                    <div>Score: {quizState.score}</div>
                </div>
                <div className="card-body items-center">
                    <h2 className="card-title text-center"
                        ref={questionNoRef}>{getFormationDisplayName(currentQuestion.answer)}</h2>
                    <div className="w-full">
                        {imageRow(currentQuestion.choices.slice(0, 2), currentQuestion.answer)}
                        {imageRow(currentQuestion.choices.slice(2), currentQuestion.answer)}
                    </div>
                </div>
                {quizState.selectedAnswer &&
                    <div className="card-actions justify-center">
            <span
                className="leading-[3rem] text-2xl mr-4">{quizState.selectedAnswer === currentQuestion.answer ? 'Correct' : 'Incorrect'}</span>
                        <button className="btn text-white" onClick={() => dispatch({type: 'nextQuestion'})}>Next
                        </button>
                    </div>
                }
            </div>
        )
    }

    function getFormationDisplayName(formation: Formation) {
        if (isRandom(formation)) {
            return `${formation.id} - ${formation.name}`
        }

        return `${formation.id}`
    }

    function canStart() {
        return quizState.questionSet.length > 0 && quizState.quizType !== undefined
    }

    function identifyFormationFromPicture(currentQuestion: Question) {
        return (
            <div className="card text-black">
                <div className="justify-between flex mb-4">
                    <div>Question {quizState.questionNo + 1}</div>
                    <div>Score: {quizState.score}</div>
                </div>
                <figure>
                    <img
                        alt="skydiving formation"
                        className="max-h-[50vh]"
                        src={getFormationImageUrl(currentQuestion.answer)}/>
                </figure>
                <div className="card-body">
                    {currentQuestion.choices.map((choice, idx) =>
                        <div className="flex flex-row gap-2" key={idx}>
                            {quizState.selectedAnswer ?
                                <button className={`btn grow no-animation ${quizState.selectedAnswer === choice ?
                                    'btn-primary' :
                                    currentQuestion.answer === choice ? 'btn-success' : 'btn-disabled darker'}`}>{getFormationDisplayName(choice)}</button>
                                :
                                <input key={`input-${idx}`}
                                       type="radio"
                                       name={`answer-${idx}`}
                                       className={`btn grow text-white ${choice === currentQuestion.answer ? 'radio-success' : ''}`}
                                       disabled={!!quizState.selectedAnswer}
                                       checked={choice === quizState.selectedAnswer}
                                       aria-label={getFormationDisplayName(choice)}
                                       onChange={() => checkAnswer(choice, currentQuestion.answer)}/>
                            }
                            {quizState.selectedAnswer &&
                                <span key={`ans-${idx}`}
                                      className="btn btn-square btn-outline text-black">{choice === currentQuestion.answer ?
                                    <CheckIcon/> : <XIcon/>}</span>
                            }
                        </div>
                    )}
                    {quizState.selectedAnswer &&
                        <div className="card-actions justify-end">
              <span
                  className="leading-[3rem] text-2xl mr-4">{quizState.selectedAnswer === currentQuestion.answer ? 'Correct' : 'Incorrect'}</span>
                            <button className="btn text-white" onClick={() => dispatch(({type: 'nextQuestion'}))}>Next
                            </button>
                        </div>
                    }
                </div>
            </div>
        );
    }

    function gameStart() {
        return (
            <div className="text-center max-w-[450px] mx-auto">
                <span className="text-5xl text-black block">Formations Quiz</span>
                <div className="form-control mt-4">
                    <input type="checkbox"
                           name="quiz-question-set"
                           className="btn text-white"
                           checked={quizState.questionSet?.includes(QuestionSet.RANDOMS)}
                           aria-label="Include randoms"
                           autoComplete="off"
                           onChange={() => dispatch({type: 'setQuestionSet', value: QuestionSet.RANDOMS})}/>
                </div>
                <div className="form-control mt-2">
                    <input type="checkbox"
                           name="quiz-question-set"
                           className="btn text-white"
                           checked={quizState.questionSet?.includes(QuestionSet.BLOCKS_A)}
                           aria-label="Include blocks"
                           autoComplete="off"
                           onChange={() => dispatch({type: 'setQuestionSet', value: QuestionSet.BLOCKS_A})}/>
                </div>
                <div className="divider"></div>
                <div className="form-control mt-4">
                    <input type="radio"
                           name="quiz-type"
                           className="btn text-white"
                           checked={quizState.quizType === QuizType.PICTURE_TO_NAME}
                           aria-label="Match the picture to the name"
                           autoComplete="off"
                           onChange={() => dispatch({type: 'setQuizType', value: QuizType.PICTURE_TO_NAME})}/>
                </div>
                <div className="form-control mt-2">
                    <input type="radio"
                           name="quiz-type"
                           checked={quizState.quizType === QuizType.NAME_TO_PICTURE}
                           className="btn text-white"
                           aria-label="Match the name to the picture"
                           autoComplete="off"
                           onChange={() => dispatch({type: 'setQuizType', value: QuizType.NAME_TO_PICTURE})}/>
                </div>
                <button className="btn text-white mt-4" disabled={!canStart()}
                        onClick={() => dispatch({type: 'startQuiz'})}>Start
                </button>
            </div>
        );
    }

    if (quizState.started && quizState.questionNo === quizState.questions.length) {
        return gameEnd();
    } else if (quizState.started) {
        const currentQuestion = quizState.questions[quizState.questionNo];
        switch (quizState.quizType) {
            case QuizType.NAME_TO_PICTURE:
                return identifyPictureFromFormation(currentQuestion);
            case QuizType.PICTURE_TO_NAME:
                return identifyFormationFromPicture(currentQuestion);
        }
    } else {
        return gameStart();
    }
}
