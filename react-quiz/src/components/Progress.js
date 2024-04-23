function Progress({ maxScores, numQuestions, index, answer, points }) {
  return (
    <header className="progress">
      <progress max={numQuestions} value={index + Number(answer !== null)} />
      <p>
        Question:{" "}
        <strong>
          {index + 1} / {numQuestions}{" "}
        </strong>
      </p>

      <p>
        <strong>
          {points} / {maxScores}
        </strong>
      </p>
    </header>
  );
}

export default Progress;
