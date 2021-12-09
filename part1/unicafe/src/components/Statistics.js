import React from "react";
import StatisticsLine from "./StatisticsLine";

export default function Statistics({ good, neutral, bad }) {
  let sum = good + neutral + bad;
  let calculateAverage = (good * 1 + neutral * 0 + bad * -1) / sum;
  let positivePercentage = (100 * good) / sum;

  return (
    <table>
      <tbody>
        <StatisticsLine text="Good" value={good} />
        <StatisticsLine text="Neutral" value={neutral} />
        <StatisticsLine text="Bad" value={bad} />
        <StatisticsLine text="All" value={sum} />
        <StatisticsLine text="Average" value={calculateAverage} />
        <StatisticsLine text="Positive" value={positivePercentage} />
      </tbody>
    </table>
  );
}
