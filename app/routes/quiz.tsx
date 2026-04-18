import type React from 'react';
import { useEffect, useReducer, useRef } from 'react';
import FormationImage from '~/components/formations/formation-images';
import { CheckIcon, XIcon } from '~/components/icons';
import QuizConfig from '~/components/quiz-config';
import { type Formation, isRandom } from '~/data/formations';
import {
    Difficulty,
    type FormationQuestion,
    initialState,
    QuizType,
    quizReducer,
    type Slot,
    type SlotQuestion,
    slots,
} from '~/state/quiz-reducer';

export default function QuizPage() {
    const [quizState, dispatch] = useReducer(quizReducer, initialState);
    const questionNoRef = useRef<HTMLDivElement>(null);

    // biome-ignore lint/correctness/useExhaustiveDependencies: scroll to top after answer selected
    useEffect(() => {
        window.scrollTo(0, document.body.scrollHeight);
    }, [quizState.selectedAnswer]);

    // biome-ignore lint/correctness/useExhaustiveDependencies: scroll to question when it changes
    useEffect(() => {
        questionNoRef?.current?.scrollIntoView();
    }, [quizState.questionNo]);

    const checkAnswer = (
        selectedAnswer: Formation,
        actualAnswer: Formation,
    ) => {
        const isCorrect = selectedAnswer === actualAnswer;
        dispatch({ type: 'answerQuestion', answer: selectedAnswer, isCorrect });
    };

    function gameEnd() {
        return (
            <div className="">
                <p className="text-center text-5xl text-black">
                    You scored {quizState.score}/{quizState.questions.length}
                </p>
                <div className="text-center mt-8 flex gap-4 justify-center">
                    <button
                        className="btn text-white"
                        onClick={() => dispatch({ type: 'startQuiz' })}
                        type="button"
                    >
                        Play again
                    </button>
                    <button
                        className="btn text-white"
                        onClick={() => dispatch({ type: 'reset' })}
                        type="button"
                    >
                        Play a different quiz
                    </button>
                </div>
            </div>
        );
    }

    function imageRow(choices: Formation[], answer: Formation) {
        const disabled = !!quizState.selectedAnswer;
        return (
            <div className="flex justify-center gap-3 mb-3">
                {choices.map((choice) => (
                    <button
                        type="button"
                        key={`button-${choice.id}`}
                        className={
                            quizState.selectedAnswer
                                ? quizState.selectedAnswer === choice
                                    ? 'ring-primary ring-offset-1 ring-4'
                                    : answer === choice
                                      ? 'ring-success ring-offset-1 ring-4'
                                      : ''
                                : ''
                        }
                        onClick={() => !disabled && checkAnswer(choice, answer)}
                        onKeyUp={(e) =>
                            !disabled && e.key === 'Enter'
                                ? checkAnswer(choice, answer)
                                : {}
                        }
                    >
                        <FormationImage
                            formation={choice}
                            key={`img-${choice.id}`}
                            className={`w-full h-full h-max max-h-[calc(50vh-35px)] mx-auto`}
                            showTooltip={false}
                        />
                    </button>
                ))}
            </div>
        );
    }

    function identifyPictureFromFormation(currentQuestion: FormationQuestion) {
        return (
            <div className="card text-black">
                <div className="justify-between flex mb-4">
                    <div>Question {quizState.questionNo + 1}</div>
                    <div>Score: {quizState.score}</div>
                </div>
                <div className="card-body items-center">
                    <h2 className="card-title text-center" ref={questionNoRef}>
                        {getFormationDisplayName(currentQuestion.answer)}
                    </h2>
                    <div className="w-full">
                        {imageRow(
                            currentQuestion.choices.slice(0, 2),
                            currentQuestion.answer,
                        )}
                        {imageRow(
                            currentQuestion.choices.slice(2),
                            currentQuestion.answer,
                        )}
                    </div>
                </div>
                {quizState.selectedAnswer && (
                    <div className="card-actions justify-center">
                        <span className="leading-[3rem] text-2xl mr-4">
                            {quizState.selectedAnswer === currentQuestion.answer
                                ? 'Correct'
                                : 'Incorrect'}
                        </span>
                        <button
                            className="btn text-white"
                            onClick={() => dispatch({ type: 'nextQuestion' })}
                            type="button"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        );
    }

    function getFormationDisplayName(formation: Formation) {
        if (isRandom(formation)) {
            return `${formation.id}${quizState.difficulty === Difficulty.EASY ? `- ${formation.name}` : ''}`;
        }

        return `${formation.id}`;
    }

    function identifyFormationFromPicture(currentQuestion: FormationQuestion) {
        return (
            <div className="card text-black">
                <div className="justify-between flex mb-4">
                    <div>Question {quizState.questionNo + 1}</div>
                    <div>Score: {quizState.score}</div>
                </div>
                <figure>
                    <FormationImage
                        formation={currentQuestion.answer}
                        className="w-full max-h-[50vh]"
                        showTooltip={false}
                    />
                </figure>
                <div className="card-body">
                    {currentQuestion.choices.map((choice, idx) => (
                        <div
                            className="flex flex-row gap-2"
                            key={`answer-${choice.id}`}
                        >
                            {quizState.selectedAnswer ? (
                                <button
                                    type="button"
                                    className={`btn grow no-animation ${
                                        quizState.selectedAnswer === choice
                                            ? 'btn-primary'
                                            : currentQuestion.answer === choice
                                              ? 'btn-success'
                                              : 'btn-disabled darker'
                                    }`}
                                >
                                    {getFormationDisplayName(choice)}
                                </button>
                            ) : (
                                <input
                                    type="radio"
                                    name={`answer-${idx}`}
                                    className={`btn grow text-white ${choice === currentQuestion.answer ? 'radio-success' : ''}`}
                                    disabled={!!quizState.selectedAnswer}
                                    checked={
                                        choice === quizState.selectedAnswer
                                    }
                                    aria-label={getFormationDisplayName(choice)}
                                    onChange={() =>
                                        checkAnswer(
                                            choice,
                                            currentQuestion.answer,
                                        )
                                    }
                                />
                            )}
                            {quizState.selectedAnswer && (
                                <span className="btn btn-square btn-outline text-black">
                                    {choice === currentQuestion.answer ? (
                                        <CheckIcon />
                                    ) : (
                                        <XIcon />
                                    )}
                                </span>
                            )}
                        </div>
                    ))}
                    {quizState.selectedAnswer && (
                        <div className="card-actions justify-end">
                            <span className="leading-[3rem] text-2xl mr-4">
                                {quizState.selectedAnswer ===
                                currentQuestion.answer
                                    ? 'Correct'
                                    : 'Incorrect'}
                            </span>
                            <button
                                type="button"
                                className="btn text-white"
                                onClick={() =>
                                    dispatch({ type: 'nextQuestion' })
                                }
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    function identifySlot(currentQuestion: SlotQuestion) {
        const handleClick = (event: React.MouseEvent<SVGSVGElement>) => {
            if (!(event.target instanceof SVGPathElement)) {
                return;
            }
            const slotClass = event.target.getAttribute('class');
            const isCorrect =
                currentQuestion.slotToIdentify.className === slotClass;
            const answer = slots.find((slot) => slot.className === slotClass);
            if (!answer) {
                return;
            }
            dispatch({ type: 'answerQuestion', answer, isCorrect });
        };
        return (
            <div className="card text-black">
                <div className="justify-between flex mb-4">
                    <div>Question {quizState.questionNo + 1}</div>
                    <div>Score: {quizState.score}</div>
                </div>
                <figure
                    className={
                        quizState.selectedAnswer === undefined ? 'quiz' : ''
                    }
                >
                    <FormationImage
                        className="w-full max-h-[75vh]"
                        formation={currentQuestion.formation}
                        onClick={(e) => handleClick(e)}
                        showTooltip={false}
                    />
                </figure>
                {quizState.selectedAnswer ? (
                    <div className="flex flex-col">
                        {quizState.selectedAnswer ===
                        currentQuestion.slotToIdentify ? (
                            <span>
                                Correct, it was {quizState.selectedAnswer.name}
                            </span>
                        ) : (
                            <span>
                                Incorrect, you found{' '}
                                {(quizState.selectedAnswer as Slot).name}
                            </span>
                        )}
                        <button
                            type="button"
                            className="btn text-white"
                            onClick={() => dispatch({ type: 'nextQuestion' })}
                        >
                            Next
                        </button>
                    </div>
                ) : null}
            </div>
        );
    }

    if (
        quizState.started &&
        quizState.questionNo === quizState.questions.length
    ) {
        return gameEnd();
    } else if (quizState.started) {
        const currentQuestion = quizState.questions[quizState.questionNo];
        switch (quizState.quizType) {
            case QuizType.NAME_TO_PICTURE:
                return identifyPictureFromFormation(
                    currentQuestion as FormationQuestion,
                );
            case QuizType.PICTURE_TO_NAME:
                return identifyFormationFromPicture(
                    currentQuestion as FormationQuestion,
                );
            case QuizType.FIND_YOUR_SLOT:
                return identifySlot(currentQuestion as SlotQuestion);
        }
    } else {
        return <QuizConfig quizState={quizState} dispatch={dispatch} />;
    }
}
