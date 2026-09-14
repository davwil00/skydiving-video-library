import type React from 'react';
import type { Dispatch } from 'react';
import FormationImage from '~/components/formations/formation-images';
import {
    type QuizAction,
    type QuizState,
    type Slot,
    type SlotQuestion,
    slots,
} from '~/state/quiz-reducer';

type IdentifySlotProps = {
    currentQuestion: SlotQuestion;
    quizState: QuizState;
    dispatch: Dispatch<QuizAction>;
};
export default function IdentifySlot(props: IdentifySlotProps) {
    const { currentQuestion, quizState, dispatch } = props;
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
                className={quizState.selectedAnswer === undefined ? 'quiz' : ''}
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
                    {quizState.selectedAnswer.answer ===
                    currentQuestion.slotToIdentify ? (
                        <span>
                            Correct, it was{' '}
                            {quizState.selectedAnswer.answer.name}
                        </span>
                    ) : (
                        <span>
                            Incorrect, you found{' '}
                            {(quizState.selectedAnswer.answer as Slot).name}
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
