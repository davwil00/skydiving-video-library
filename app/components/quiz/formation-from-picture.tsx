import type { Dispatch } from 'react';
import FormationImage from '~/components/formations/formation-images';
import { CheckIcon, XIcon } from '~/components/icons';
import { getFormationDisplayName } from '~/components/quiz/quiz-utils';
import type { Formation } from '~/data/formations';
import type {
    FormationQuestion,
    QuizAction,
    QuizState,
} from '~/state/quiz-reducer';

type FormationFromPictureProps = {
    currentQuestion: FormationQuestion;
    quizState: QuizState;
    dispatch: Dispatch<QuizAction>;
};

export default function FormationFromPicture(props: FormationFromPictureProps) {
    const { currentQuestion, quizState, dispatch } = props;

    const checkAnswer = (givenAnswer: Formation, correctAnswer: Formation) => {
        dispatch({
            type: 'answerQuestion',
            givenAnswer: givenAnswer,
            correctAnswer: correctAnswer,
        });
    };

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
                                    quizState.selectedAnswer.answer === choice
                                        ? 'btn-primary'
                                        : currentQuestion.answer === choice
                                          ? 'btn-success'
                                          : 'btn-disabled darker'
                                }`}
                            >
                                {getFormationDisplayName(
                                    choice,
                                    quizState.difficulty,
                                )}
                            </button>
                        ) : (
                            <input
                                type="radio"
                                name={`answer-${idx}`}
                                className={`btn grow text-white ${choice === currentQuestion.answer ? 'radio-success' : ''}`}
                                disabled={!!quizState.selectedAnswer}
                                checked={choice === quizState.selectedAnswer}
                                aria-label={getFormationDisplayName(choice)}
                                onChange={() =>
                                    checkAnswer(choice, currentQuestion.answer)
                                }
                            />
                        )}
                        {quizState.selectedAnswer && (
                            <span className="btn btn-square btn-outline text-black">
                                {choice.id === currentQuestion.answer.id ? (
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
                        <span className="leading-12 text-2xl mr-4">
                            {quizState.selectedAnswer.isCorrect
                                ? 'Correct'
                                : 'Incorrect'}
                        </span>
                        <button
                            type="button"
                            className="btn text-white"
                            onClick={() => dispatch({ type: 'nextQuestion' })}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
