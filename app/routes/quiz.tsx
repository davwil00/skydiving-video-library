import { useReducer } from "react";
import { CheckIcon, XIcon } from "~/components/icons";
import { getFormationImageUrl } from "~/utils";
import { initialState, type Question, type QuestionSet, quizReducer, type QuizType } from "~/state/quiz-reducer";
import { type Formation, getDisplayName } from "~/data/formations";

const QUESTIONS_PER_ROUND = 10;

export default function QuizPage() {
  const [quizState, dispatch] = useReducer(quizReducer, initialState)

  const checkAnswer = (selectedAnswer: Formation, actualAnswer: Formation) => {
    const isCorrect = selectedAnswer === actualAnswer;
    dispatch({type: "answerQuestion", answer: selectedAnswer, isCorrect})
  };

  function gameEnd() {
    return (
      <div className="">
        <p className="text-center text-5xl text-black">You scored {quizState.score}/10</p>
        <div className="text-center mt-8">
          <button className="btn text-white" onClick={() => dispatch({type: "reset"})}>Play again</button>
        </div>
      </div>
    );
  }

  function imageRow(choices: Formation[], answer: Formation) {
    const disabled = !!quizState.selectedAnswer
    return (
      <div className="flex justify-center gap-2 mb-2">
        {choices.map((choice, idx) =>
          <figure key={idx} className={quizState.selectedAnswer ?
              quizState.selectedAnswer === choice ? 'ring-primary ring-offset-1 ring-4' :
              answer === choice ? 'ring-success ring-offset-1 ring-4' : ''
              : ''}>
            <img
              key={idx}
              className={`w-max`}
              alt="skydiving formation"
              src={getFormationImageUrl(choice)}
              onClick={() => !disabled && checkAnswer(choice, answer)}
            />
          </figure>
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
          <h2 className="card-title text-center">{`${currentQuestion.answer.id} -${getDisplayName(currentQuestion.answer)}`}</h2>
          <div className="w-full">
            {imageRow(currentQuestion.choices.slice(0,2), currentQuestion.answer)}
            {imageRow(currentQuestion.choices.slice(2), currentQuestion.answer)}
          </div>
        </div>
        {quizState.selectedAnswer &&
          <div className="card-actions justify-center">
            <span
              className="leading-[3rem] text-2xl mr-4">{quizState.selectedAnswer === currentQuestion.answer ? "Correct" : "Incorrect"}</span>
            <button className="btn text-white" onClick={() => dispatch({type: "nextQuestion" })}>Next</button>
          </div>
        }
      </div>
    )
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
            src={getFormationImageUrl(currentQuestion.answer)} />
        </figure>
        <div className="card-body">
          {currentQuestion.choices.map((choice, idx) =>
            <div className="flex flex-row gap-2" key={idx}>
              {quizState.selectedAnswer ?
                <button className={`btn grow no-animation ${quizState.selectedAnswer === choice ?
                  'btn-primary':  
                  currentQuestion.answer === choice ? 'btn-success' : 'btn-disabled'}`}>{choice.id} - {getDisplayName(choice)}</button>
                :
              <input key={`input-${idx}`}
                     type="radio"
                     name={`answer-${idx}`}
                     className={`btn grow text-white ${choice === currentQuestion.answer ? 'radio-success' : ''}`}
                     disabled={!!quizState.selectedAnswer}
                     checked={choice === quizState.selectedAnswer}
                     aria-label={`${choice.id} - ${getDisplayName(choice)}`}
                     onChange={() => checkAnswer(choice, currentQuestion.answer)} />
              }
              {quizState.selectedAnswer &&
                <span key={`ans-${idx}`}
                      className="btn btn-square btn-outline text-black">{choice === currentQuestion.answer ?
                  <CheckIcon /> : <XIcon />}</span>
              }
            </div>
          )}
          {quizState.selectedAnswer &&
            <div className="card-actions justify-end">
              <span
                className="leading-[3rem] text-2xl mr-4">{quizState.selectedAnswer === currentQuestion.answer ? "Correct" : "Incorrect"}</span>
              <button className="btn text-white" onClick={() => dispatch(({type: "nextQuestion"}))}>Next</button>
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
                 onChange={() => dispatch({type: "setQuestionSet", value: QuestionSet.RANDOMS})} />
        </div>
        <div className="form-control mt-4">
          <input type="checkbox"
                 name="quiz-question-set"
                 className="btn text-white"
                 checked={quizState.questionSet?.includes(QuestionSet.BLOCKS_A)}
                 aria-label="Include blocks"
                 autoComplete="off"
                 onChange={() => dispatch({type: "setQuestionSet", value: QuestionSet.BLOCKS_A})} />
        </div>
        <div className="divider"></div>
        <div className="form-control mt-4">
          <input type="radio"
                 name="quiz-type"
                 className="btn text-white"
                 checked={quizState.quizType === QuizType.PICTURE_TO_NAME}
                 aria-label="Match the picture to the name"
                 autoComplete="off"
                 onChange={() => dispatch({ type: "setQuizType", value: QuizType.PICTURE_TO_NAME })} />
        </div>
        <div className="form-control mt-2">
          <input type="radio"
                 name="quiz-type"
                 checked={quizState.quizType === QuizType.NAME_TO_PICTURE}
                 className="btn text-white"
                 aria-label="Match the name to the picture"
                 autoComplete="off"
                 onChange={() => dispatch({type: "setQuizType", value: QuizType.NAME_TO_PICTURE })} />
        </div>
        <button className="btn text-white mt-4" onClick={() => dispatch({type: "startQuiz"})}>Start</button>
      </div>
    );
  }

  if (quizState.questionNo === QUESTIONS_PER_ROUND) {
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
