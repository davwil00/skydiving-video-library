import { useState } from "react";
import { CheckIcon, XIcon } from "~/components/icons";
import { getFormationImageUrl } from "~/utils";

const QUESTIONS_PER_ROUND = 10;

type Formation = {
  letter: string
  name: string
}

type Question = {
  answer: Formation
  choices: Formation[]
}

enum QuizType {
  NAME_TO_PICTURE,
  PICTURE_TO_NAME
}

type QuizState = {
  started: boolean
  questionNo: number
  score: number
  questions: Question[]
  selectedAnswer?: Formation
  quizType?: QuizType
}

const FORMATIONS: Formation[] = [
  { letter: "A", name: "Unipod" },
  { letter: "B", name: "Stairstep Diamond" },
  { letter: "C", name: "Murphy Flake" },
  { letter: "D", name: "Yuan" },
  { letter: "E", name: "Meeker" },
  { letter: "F", name: "Open Accordian" },
  { letter: "G", name: "Cataccord" },
  { letter: "H", name: "Bow" },
  { letter: "J", name: "Donut" },
  { letter: "K", name: "Hook" },
  { letter: "L", name: "Adder" },
  { letter: "M", name: "Star" },
  { letter: "N", name: "Crank" },
  { letter: "O", name: "Satellite" },
  { letter: "P", name: "Sidebody" },
  { letter: "Q", name: "Phalanx" }
];

function generateQuestions(): Question[] {
  const formations = [...FORMATIONS];
  shuffle(formations);
  return formations.slice(0, 10).map(formation => ({
    answer: formation,
    choices: generateMultipleChoiceAnswers(formation)
  }));
}

function generateMultipleChoiceAnswers(actualAnswer: Formation): Formation[] {
  const possibleAnswers = [...FORMATIONS];
  const actualAnswerIdx = possibleAnswers.indexOf(actualAnswer);
  possibleAnswers.splice(actualAnswerIdx, 1);
  shuffle(possibleAnswers);
  const answers = possibleAnswers.slice(0, 3).concat(actualAnswer);
  shuffle(answers);
  return answers;
}

function shuffle(a: any[], b?: number, c?: number, d?: string) {
  c = a.length;
  while (c) {
    b = Math.random() * (--c + 1) | 0;
    d = a[c];
    a[c] = a[b];
    a[b] = d;
  }
}

const initialState: QuizState = {
  started: false,
  questionNo: 0,
  score: 0,
  questions: [],
  selectedAnswer: undefined,
  quizType: undefined
};

// From https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array#answer-25984542
export default function QuizPage() {
  const [quizState, setQuizState] = useState<QuizState>(initialState);

  const startQuiz = () => {
    setQuizState(prevState => ({
      ...initialState,
      quizType: prevState.quizType,
      started: true,
      questions: generateQuestions()
    }));
  };

  const reset = () => {
    setQuizState({ ...initialState })
  }

  const next = () => {
    setQuizState(prevState => ({
      ...prevState,
      questionNo: prevState.questionNo + 1,
      selectedAnswer: undefined
    }));
  };

  const checkAnswer = (selectedAnswer: Formation, actualAnswer: Formation) => {
    setQuizState(prevState => ({
      ...prevState,
      score: selectedAnswer === actualAnswer ? prevState.score + 1 : prevState.score,
      selectedAnswer: selectedAnswer
    }));
  };

  function gameEnd() {
    return (
      <div className="">
        <p className="text-center text-5xl text-black">You scored {quizState.score}/10</p>
        <div className="text-center mt-8">
          <button className="btn text-white" onClick={reset}>Play again</button>
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
          <h2 className="card-title text-center">{`${currentQuestion.answer.letter} -${currentQuestion.answer.name}`}</h2>
          <div className="w-full">
            {imageRow(currentQuestion.choices.slice(0,2), currentQuestion.answer)}
            {imageRow(currentQuestion.choices.slice(2), currentQuestion.answer)}
          </div>
        </div>
        {quizState.selectedAnswer &&
          <div className="card-actions justify-center">
            <span
              className="leading-[3rem] text-2xl mr-4">{quizState.selectedAnswer === currentQuestion.answer ? "Correct" : "Incorrect"}</span>
            <button className="btn text-white" onClick={next}>Next</button>
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
                  currentQuestion.answer === choice ? 'btn-success' : 'btn-disabled'}`}>{choice.letter} - {choice.name}</button>
                :
              <input key={`input-${idx}`}
                     type="radio"
                     name={`answer-${idx}`}
                     className={`btn grow text-white ${choice === currentQuestion.answer ? 'radio-success' : ''}`}
                     disabled={!!quizState.selectedAnswer}
                     checked={choice === quizState.selectedAnswer}
                     aria-label={`${choice.letter}-${choice.name}`}
                     onClick={() => checkAnswer(choice, currentQuestion.answer)} />
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
              <button className="btn text-white" onClick={next}>Next</button>
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
          <input type="radio"
                 name="quiz-type"
                 className="btn text-white"
                 checked={quizState.quizType === QuizType.PICTURE_TO_NAME}
                 aria-label="Match the picture to the name"
                 onClick={() => setQuizState(prevState => ({...prevState, quizType: QuizType.PICTURE_TO_NAME}))}/>
        </div>
        <div className="form-control mt-2">
          <input type="radio"
                 name="quiz-type"
                 checked={quizState.quizType === QuizType.NAME_TO_PICTURE}
                 className="btn text-white"
                 aria-label="Match the name to the picture"
                 onClick={() => setQuizState(prevState => ({...prevState, quizType: QuizType.NAME_TO_PICTURE}))}/>
        </div>
        <button className="btn text-white mt-4" onClick={startQuiz}>Start</button>
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
