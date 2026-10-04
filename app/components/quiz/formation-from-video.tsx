import type { Dispatch, KeyboardEvent } from 'react';
import type {
    QuizAction,
    QuizState,
    VideoQuestion,
} from '~/state/quiz-reducer';

type FormationFromVideoProps = {
    currentQuestion: VideoQuestion;
    quizState: QuizState;
    dispatch: Dispatch<QuizAction>;
};

export default function FormationFromVideo(props: FormationFromVideoProps) {
    const { currentQuestion, quizState, dispatch } = props;
    const isLetter = (value: string) => 'abcdefghjklmnopq'.includes(value);
    const isNumber = (value: string) => '0123456789'.includes(value);

    const keyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        const target = event.currentTarget;
        if (
            target.selectionStart !== target.selectionEnd &&
            (isLetter(event.key) ||
                isNumber(event.key) ||
                event.key === 'backspace')
        ) {
            return;
        }
        if (event.key === 'Backspace') {
            if (target.value.length === 0) {
                const nextElt =
                    target.previousElementSibling as HTMLInputElement;
                nextElt?.focus();
                nextElt.selectionStart = nextElt.value.length;
            }
            return;
        } else if (isLetter(event.key)) {
            if (target.value.length === 1) {
                const nextElt = target.nextElementSibling as HTMLInputElement;
                if (nextElt) {
                    nextElt.focus();
                } else {
                    event.preventDefault();
                }
            }
        } else if (isNumber(event.key)) {
            if (target.value.length === 2) {
                (target.nextElementSibling as HTMLInputElement)?.focus();
            }
        } else event.preventDefault();
    };
    const keyUp = (event: KeyboardEvent<HTMLInputElement>) => {
        const target = event.currentTarget;
        if (event.key === 'Backspace') {
            if (target.value.length === 0) {
                const nextElt =
                    target.previousElementSibling as HTMLInputElement;
                nextElt?.focus();
                nextElt.selectionStart = nextElt.value.length;
            }
            return;
        } else if (isLetter(event.key)) {
            const nextElt = target.nextElementSibling as HTMLInputElement;
            if (nextElt) {
                nextElt.focus();
                nextElt.selectionStart = nextElt.value.length;
            }
        } else if ('0123456789'.includes(event.key)) {
            if (target.value.length === 1) {
                (target.nextElementSibling as HTMLInputElement)?.focus();
            }
        }
    };
    return (
        <div className="w-full form-light">
            <video
                src={currentQuestion.videoUrl}
                controls
                muted={true}
                className="w-full mb-4"
            />
            <span>Answer:</span>
            <div className="flex gap-2 mt-4 items-center">
                {currentQuestion.givenAnswer.map((answer, index) => (
                    <input
                        type="text"
                        maxLength={2}
                        key={`${quizState.questionNo}-answer-${index}`}
                        className="w-[3em] input input-bordered uppercase text-center"
                        name="answer"
                        onKeyDown={keyDown}
                        onKeyUp={keyUp}
                        onChange={(e) =>
                            dispatch({
                                type: 'setVideoQuestionAnswerPart',
                                answerIndex: index,
                                answer: e.currentTarget.value,
                            })
                        }
                        value={answer}
                    />
                ))}
                {quizState.selectedAnswer ? (
                    <span className="">
                        {quizState.selectedAnswer.isCorrect
                            ? 'Correct!'
                            : `Incorrect, it was ${currentQuestion.correctAnswer.join(', ')}`}
                    </span>
                ) : null}
            </div>
            {quizState.selectedAnswer ? (
                <button
                    type="button"
                    className="btn btn-primary mt-4"
                    onClick={() => {
                        dispatch({ type: 'nextQuestion' });
                    }}
                >
                    Next question
                </button>
            ) : (
                <button
                    type="button"
                    className="btn btn-primary mt-4"
                    onClick={() => {
                        dispatch({
                            type: 'answerQuestion',
                            givenAnswer: currentQuestion.givenAnswer.join(''),
                            correctAnswer:
                                currentQuestion.correctAnswer.join(''),
                        });
                    }}
                >
                    Check answer
                </button>
            )}
        </div>
    );
}
