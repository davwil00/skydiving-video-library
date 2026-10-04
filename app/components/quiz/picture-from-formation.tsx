import type { Dispatch, Ref } from 'react';
import FormationImage from '~/components/formations/formation-images';
import { getFormationDisplayName } from '~/components/quiz/quiz-utils';
import type { Formation } from '~/data/formations';
import type {
    FormationQuestion,
    QuizAction,
    QuizState,
} from '~/state/quiz-reducer';

type PictureFromFormationProps = {
    currentQuestion: FormationQuestion;
    quizState: QuizState;
    dispatch: Dispatch<QuizAction>;
    questionNoRef: Ref<HTMLDivElement>;
};

export default function PictureFromFormation(props: PictureFromFormationProps) {
    const { currentQuestion, quizState, dispatch, questionNoRef } = props;

    const checkAnswer = (givenAnswer: Formation, correctAnswer: Formation) => {
        dispatch({ type: 'answerQuestion', givenAnswer, correctAnswer });
    };

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
                                ? (quizState.selectedAnswer.answer as Formation).id === choice.id
                                    ? 'ring-primary ring-offset-1 ring-4'
                                    : answer.id === choice.id
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
                            className={`w-full h-max max-h-[calc(50vh-35px)] mx-auto`}
                            showTooltip={false}
                        />
                    </button>
                ))}
            </div>
        );
    }

    return (
        <div className="card text-black">
            <div className="justify-between flex mb-4">
                <div>Question {quizState.questionNo + 1}</div>
                <div>Score: {quizState.score}</div>
            </div>
            <div className="card-body items-center">
                <h2 className="card-title text-center" ref={questionNoRef}>
                    {getFormationDisplayName(
                        currentQuestion.answer,
                        quizState.difficulty,
                    )}
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
                    <span className="leading-12 text-2xl mr-4">
                        {quizState.selectedAnswer.isCorrect
                            ? 'Correct'
                            : `Incorrect - that was ${(quizState.selectedAnswer.answer as Formation).id}`}
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
