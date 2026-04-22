import type React from 'react';
import { Discipline, Level, Type } from '~/data/formations';
import {
    containsQuestionSet,
    Difficulty,
    DivePool,
    QuestionSet,
    type QuizAction,
    type QuizState,
    QuizType,
    slots,
} from '~/state/quiz-reducer';

type QuizConfigProps = {
    quizState: QuizState;
    dispatch: React.Dispatch<QuizAction>;
};

export default function QuizConfig(quizConfigProps: QuizConfigProps) {
    const { quizState, dispatch } = quizConfigProps;
    const QuizTypeConfig = () => {
        return (
            <>
                <h2>Quiz Type:</h2>
                <div className="flex flex-wrap gap-2">
                    <input
                        type="radio"
                        name="quiz-type"
                        className="btn text-white"
                        checked={
                            quizState.quizType === QuizType.PICTURE_TO_NAME
                        }
                        aria-label="Match the picture to the name"
                        autoComplete="off"
                        onChange={() =>
                            dispatch({
                                type: 'setQuizType',
                                value: QuizType.PICTURE_TO_NAME,
                            })
                        }
                    />
                    <input
                        type="radio"
                        name="quiz-type"
                        checked={
                            quizState.quizType === QuizType.NAME_TO_PICTURE
                        }
                        className="btn text-white"
                        aria-label="Match the name to the picture"
                        autoComplete="off"
                        onChange={() =>
                            dispatch({
                                type: 'setQuizType',
                                value: QuizType.NAME_TO_PICTURE,
                            })
                        }
                    />
                    <input
                        type="radio"
                        name="quiz-type"
                        checked={quizState.quizType === QuizType.FIND_YOUR_SLOT}
                        className="btn text-white"
                        aria-label="Find your slot"
                        autoComplete="off"
                        onChange={() => {
                            dispatch({
                                type: 'setQuizType',
                                value: QuizType.FIND_YOUR_SLOT,
                            });
                            dispatch({
                                type: 'setDivePool',
                                value: DivePool.EIGHT_WAY,
                            });
                        }}
                    />
                </div>
            </>
        );
    };

    const DivePoolConfig = () => {
        if (
            quizState.quizType == null ||
            quizState.quizType === QuizType.FIND_YOUR_SLOT
        ) {
            return null;
        }
        return (
            <>
                <h2>Divepool(s)</h2>
                <div className="flex gap-2">
                    <input
                        type="checkbox"
                        name="quiz-question-set"
                        className="text-white btn"
                        checked={quizState.divePool?.includes(
                            DivePool.FOUR_WAY,
                        )}
                        aria-label="4 Way"
                        autoComplete="off"
                        onChange={() =>
                            dispatch({
                                type: 'setDivePool',
                                value: DivePool.FOUR_WAY,
                            })
                        }
                    />
                    <input
                        type="checkbox"
                        name="quiz-question-set"
                        className=" text-white btn"
                        checked={quizState.divePool?.includes(
                            DivePool.EIGHT_WAY,
                        )}
                        aria-label="8 Way"
                        autoComplete="off"
                        onChange={() =>
                            dispatch({
                                type: 'setDivePool',
                                value: DivePool.EIGHT_WAY,
                            })
                        }
                    />
                </div>
            </>
        );
    };

    const FormationsConfig = () => {
        if (quizState.divePool.length < 1) {
            return null;
        }
        const makeFormationInput = (
            label: string,
            questionSet: QuestionSet,
        ) => {
            return (
                <input
                    type="checkbox"
                    name="quiz-question-set"
                    className="text-white btn"
                    checked={containsQuestionSet(
                        quizState.questionSets,
                        questionSet,
                    )}
                    aria-label={label}
                    autoComplete="off"
                    onChange={() =>
                        dispatch({ type: 'setQuestionSet', value: questionSet })
                    }
                />
            );
        };
        const formationOptions = [];
        if (quizState.divePool.includes(DivePool.FOUR_WAY)) {
            formationOptions.push(
                {
                    label: 'Randoms',
                    questionSet: new QuestionSet(
                        Discipline.FOUR_WAY,
                        Level.ROOKIE,
                        Type.RANDOM,
                    ),
                },
                {
                    label: 'A blocks',
                    questionSet: new QuestionSet(
                        Discipline.FOUR_WAY,
                        Level.A,
                        Type.BLOCK,
                    ),
                },
                {
                    label: 'AA blocks',
                    questionSet: new QuestionSet(
                        Discipline.FOUR_WAY,
                        Level.AA,
                        Type.BLOCK,
                    ),
                },
                {
                    label: 'AAA blocks',
                    questionSet: new QuestionSet(
                        Discipline.FOUR_WAY,
                        Level.AAA,
                        Type.BLOCK,
                    ),
                },
            );
        }
        if (quizState.divePool.includes(DivePool.EIGHT_WAY)) {
            formationOptions.push(
                {
                    label: 'Intermediate Randoms',
                    questionSet: new QuestionSet(
                        Discipline.EIGHT_WAY,
                        Level.INTERMEDIATE,
                        Type.RANDOM,
                    ),
                },
                {
                    label: 'Intermediate Blocks',
                    questionSet: new QuestionSet(
                        Discipline.EIGHT_WAY,
                        Level.INTERMEDIATE,
                        Type.BLOCK,
                    ),
                },
                {
                    label: 'Senior Blocks',
                    questionSet: new QuestionSet(
                        Discipline.EIGHT_WAY,
                        Level.SENIOR,
                        Type.BLOCK,
                    ),
                },
            );
        }
        return (
            <>
                <h2>Formations to include:</h2>
                <div className="flex flex-wrap gap-2">
                    {formationOptions.map((option) =>
                        makeFormationInput(option.label, option.questionSet),
                    )}
                </div>
            </>
        );
    };

    const SlotConfig = () => {
        if (
            quizState.quizType !== QuizType.FIND_YOUR_SLOT ||
            quizState.divePool.length < 1
        ) {
            return null;
        }
        const slotsAvailable = slots.filter((slot) =>
            slot.divePools.some((divePool) =>
                quizState.divePool.includes(divePool),
            ),
        );

        return (
            <>
                <h2>Slots to include:</h2>
                <div className="flex flex-wrap gap-2">
                    {slotsAvailable.map((slot) => (
                        <input
                            key={slot.className}
                            type="checkbox"
                            name="quiz-slot"
                            className="text-white btn"
                            checked={quizState.slots.includes(slot)}
                            aria-label={slot.name}
                            autoComplete="off"
                            onChange={() =>
                                dispatch({ type: 'setSlot', value: slot })
                            }
                        />
                    ))}
                </div>
            </>
        );
    };

    const DifficultyConfig = () => {
        if (
            !(
                quizState.quizType === QuizType.NAME_TO_PICTURE ||
                quizState.quizType === QuizType.PICTURE_TO_NAME
            )
        ) {
            return null;
        }

        if (
            quizState.questionSets.length === 0 ||
            quizState.questionSets.every((qs) => qs.type === Type.BLOCK)
        ) {
            return null;
        }

        return (
            <>
                <h2>Difficulty:</h2>
                <div className="flex flex-wrap gap-2">
                    <input
                        type="radio"
                        name="quiz-difficulty"
                        className="btn text-white"
                        checked={quizState.difficulty === Difficulty.EASY}
                        aria-label="Easy (with formation names)"
                        autoComplete="off"
                        onChange={() =>
                            dispatch({
                                type: 'setDifficulty',
                                value: Difficulty.EASY,
                            })
                        }
                    />
                    <input
                        type="radio"
                        name="quiz-difficulty"
                        className="btn text-white"
                        checked={quizState.difficulty === Difficulty.HARD}
                        aria-label="Hard: (Letters/Numbers only)"
                        autoComplete="off"
                        onChange={() =>
                            dispatch({
                                type: 'setDifficulty',
                                value: Difficulty.HARD,
                            })
                        }
                    />
                </div>
            </>
        );
    };

    function canStart() {
        if (!quizState.quizType || quizState.questionSets.length === 0) {
            return false;
        }
        switch (quizState.quizType) {
            case QuizType.FIND_YOUR_SLOT:
                return quizState.slots.length > 0;
            default:
                return !!quizState.divePool;
        }
    }

    return (
        <div className="flex flex-col mx-auto">
            <h1 className="text-5xl text-black block">Formations Quiz</h1>
            <div className="mt-4 flex flex-col gap-4 ">
                <QuizTypeConfig />
                <h2>Number of questions</h2>
                <div className="flex gap-2">
                    <select
                        className="text-white select"
                        autoComplete="off"
                        onChange={(e) =>
                            dispatch({
                                type: 'setNumberOfQuestions',
                                value: parseInt(e.target.value, 10),
                            })
                        }
                    >
                        {[5, 10, 15, 20].map((num) => (
                            <option
                                key={`numberOfQs-${num}`}
                                selected={quizState.numberOfQuestions === num}
                            >
                                {num}
                            </option>
                        ))}
                    </select>
                </div>
                <DivePoolConfig />
                <FormationsConfig />
                <DifficultyConfig />
                <SlotConfig />

                <button
                    className="btn text-white mt-4"
                    disabled={!canStart()}
                    onClick={() => dispatch({ type: 'startQuiz' })}
                    type="button"
                >
                    Start
                </button>
            </div>
        </div>
    );
}
