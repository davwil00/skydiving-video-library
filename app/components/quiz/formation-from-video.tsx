import type { Dispatch } from 'react';
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
                            givenAnswer: currentQuestion.givenAnswer
                                .join(',')
                                .toUpperCase(),
                            correctAnswer: currentQuestion.correctAnswer
                                .join(',')
                                .toUpperCase(),
                        });
                    }}
                >
                    Check answer
                </button>
            )}
        </div>
    );
}
