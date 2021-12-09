import React, { useState } from "react";
import Button from "./components/Button";
import Statistics from "./components/Statistics";
import "./App.css";

function App() {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  function handleClick(selector) {
    switch (selector) {
      case "Good":
        setGood((prevGood) => prevGood + 1);
        break;
      case "Neutral":
        setNeutral((prevNeutral) => prevNeutral + 1);
        break;
      case "Bad":
        setBad((prevBad) => prevBad + 1);
        break;
      default:
        console.log("Wrong selector!");
    }
  }

  let displayCondition = good || neutral || bad;

  return (
    <div>
      <h2>Give Feedback</h2>
      <div>
        <Button selector="Good" handleClick={handleClick} />
        <Button selector="Neutral" handleClick={handleClick} />
        <Button selector="Bad" handleClick={handleClick} />
      </div>
      <h2>Statistics</h2>
      {displayCondition ? (
        <Statistics good={good} neutral={neutral} bad={bad} />
      ) : (
        "No feedback given."
      )}
    </div>
  );
}

export default App;
