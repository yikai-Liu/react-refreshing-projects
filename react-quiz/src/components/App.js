import Header from "./Header";
import Loader from "./Loader";
import Main from "./Main";
import Error from "./Error";
import Question from "./Question";
import { useEffect, useReducer } from "react";
import StartScreen from "./StartScreen";
import NextButton from "./NextButton";
import Progress from "./Progress";

const initialState = {
  questions: [],
  // "loading", "ready", "error", "active", "finished"
  status: "loading",
  index: 0,
  points: 0,
  answer: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return { ...state, questions: action.payload, status: "ready" };
    case "dataFailed":
      return { ...state, status: "error" };
    case "start":
      return { ...state, status: "active" };
    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };
    case "newAnswer":
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };

    default:
      throw new Error("Not allowed action type");
  }
}

export default function App() {
  const [{ questions, status, index, answer, points }, dispatch] = useReducer(
    reducer,
    initialState
  );

  const maxScores = questions.reduce((prev, curr) => prev + curr.points, 0);
  const numQuestions = questions.length;
  useEffect(function () {
    fetch("http://localhost:8000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch((error) => dispatch({ type: "dataFailed" }));
  }, []);

  return (
    <div className="app">
      <Header />

      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === "active" && (
          <>
            <Progress
              maxScores={maxScores}
              numQuestions={numQuestions}
              index={index}
              answer={answer}
              points={points}
            />
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <NextButton dispatch={dispatch} answer={answer} />
          </>
        )}
      </Main>
    </div>
  );
}
