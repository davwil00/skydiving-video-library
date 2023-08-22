import { useState } from "react";
import { CheckIcon, XIcon } from "~/components/icons";

const QUESTIONS_PER_ROUND = 10;

type Formation = {
  letter: string
  name: string
}

type Question = {
  answer: Formation
  choices: Formation[]
}

type QuizState = {
  started: boolean
  questionNo: number
  score: number
  questions: Question[]
  selectedAnswer?: Formation
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
  const answers = possibleAnswers.slice(0, 2).concat(actualAnswer);
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

const initialState = {
  started: false,
  questionNo: 0,
  score: 0,
  questions: [],
  showAnswer: false,
  selectedAnswer: undefined
};

// From https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array#answer-25984542
export default function QuizPage() {
  const [quizState, setQuizState] = useState<QuizState>(initialState);

  const startQuiz = () => {
    setQuizState({
      ...initialState,
      started: true,
      questions: generateQuestions()
    });
  };

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

  if (quizState.questionNo === QUESTIONS_PER_ROUND) {
    return (
      <div className="">
        <p className="text-center text-5xl text-black">You scored {quizState.score}/10</p>
        <div className="text-center mt-8">
          <button className="btn text-white" onClick={startQuiz}>Play again</button>
        </div>
      </div>
    );
  } else if (quizState.started) {
    const currentQuestion = quizState.questions[quizState.questionNo];
    return (
      <div className="card text-black">
        <div className="justify-between flex mb-4">
          <div>Question {quizState.questionNo + 1}</div>
          <div>Score: {quizState.score}</div>
        </div>
        <figure>
          <img
            alt="skydiving formation"
            src={`/images/${currentQuestion.answer.letter}-${currentQuestion.answer.name.replace(" ", "-")}.png`.toLowerCase()} />
        </figure>
        <div className="card-body">
          {currentQuestion.choices.map((choice, idx) =>
            <div className="flex flex-row gap-2" key={idx}>
              <input key={`input-${idx}`}
                     type="radio"
                     name={`answer-${idx}`}
                     className="btn grow"
                     checked={choice === quizState.selectedAnswer}
                     aria-label={`${choice.letter}-${choice.name}`}
                     onClick={() => checkAnswer(choice, currentQuestion.answer)} />

              {quizState.selectedAnswer &&
                <span key={`ans-${idx}`} className="btn btn-square btn-outline text-black">{choice === currentQuestion.answer ? <CheckIcon /> : <XIcon />}</span>
              }
            </div>
          )}
          {quizState.selectedAnswer &&
            <div className="card-actions justify-end">
              <span className="leading-[3rem] text-2xl mr-4">{quizState.selectedAnswer === currentQuestion.answer ? 'Correct' : 'Incorrect'}</span>
              <button className="btn text-white" onClick={next}>Next</button>
            </div>
          }
        </div>
      </div>
    );
  } else {
    return (
      <div className="text-center">
        <span className="text-5xl text-black">Formations Quiz</span>
        <button className="btn text-white mt-4" onClick={startQuiz}>Start</button>
      </div>
    );
  }
}
