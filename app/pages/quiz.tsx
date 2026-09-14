import { useEffect, useReducer, useRef } from 'react';
import FormationFromPicture from '~/components/quiz/formation-from-picture';
import FormationFromVideo from '~/components/quiz/formation-from-video';
import IdentifySlot from '~/components/quiz/IdentifySlot';
import PictureFromFormation from '~/components/quiz/picture-from-formation';
import QuizConfig from '~/components/quiz-config';
import {
    type FormationQuestion,
    initialState,
    type Question,
    QuizType,
    quizReducer,
    type SlotQuestion,
    type VideoQuestion,
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

    function gameEnd() {
        return (
            <div>
                <p className="text-center text-5xl text-black">
                    You scored {quizState.score}/{quizState.questions.length}
                </p>
                <div className="text-center mt-8 flex gap-4 justify-center">
                    <button
                        className="btn text-white"
                        onClick={async () => {
                            const questions: Question[] = await fetch(
                                '/api/generate-quiz-questions',
                                {
                                    method: 'POST',
                                    body: JSON.stringify(quizState),
                                },
                            ).then((res) => res.json());
                            dispatch({ type: 'startQuiz', questions });
                        }}
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

    if (
        quizState.started &&
        quizState.questionNo === quizState.questions.length
    ) {
        return gameEnd();
    } else if (quizState.started) {
        const currentQuestion = quizState.questions[quizState.questionNo];
        switch (quizState.quizType) {
            case QuizType.NAME_TO_PICTURE:
                return (
                    <PictureFromFormation
                        currentQuestion={currentQuestion as FormationQuestion}
                        quizState={quizState}
                        dispatch={dispatch}
                        questionNoRef={questionNoRef}
                    />
                );
            case QuizType.PICTURE_TO_NAME:
                return (
                    <FormationFromPicture
                        currentQuestion={currentQuestion as FormationQuestion}
                        quizState={quizState}
                        dispatch={dispatch}
                    />
                );
            case QuizType.FIND_YOUR_SLOT:
                return (
                    <IdentifySlot
                        currentQuestion={currentQuestion as SlotQuestion}
                        quizState={quizState}
                        dispatch={dispatch}
                    />
                );
            case QuizType.VIDEO:
                return (
                    <FormationFromVideo
                        currentQuestion={currentQuestion as VideoQuestion}
                        quizState={quizState}
                        dispatch={dispatch}
                    />
                );
        }
    } else {
        return <QuizConfig quizState={quizState} dispatch={dispatch} />;
    }
}
