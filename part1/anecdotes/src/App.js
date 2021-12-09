import React, { useState } from "react";
import "./App.css";

function App() {
  const anecdotes = [
    "If it hurts, do it more often",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients",
  ];

  const [selected, setSelected] = useState(0);
  // Alternative option for initial state of votes state
  /*const [votes, setVotes] = useState({
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
  });*/
  const [votes, setVotes] = useState({});

  // console.log(selected);

  function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  // Alternative option handleClickVote function
  /*function handleClickVote() {
    setVotes((prevVotes) => ({
      ...prevVotes,
      [selected]: prevVotes[selected] + 1,
    }));
  }*/

  function handleClickVote() {
    setVotes((prevVotes) => ({
      ...prevVotes,
      [selected]: prevVotes[selected] + 1 || 1,
    }));
  }

  // console.log(votes);

  function handleClickNext() {
    setSelected(getRandomNumber(0, anecdotes.length));
  }

  let conditionVotes = Object.keys(votes).length;
  let mostVotes;
  if (conditionVotes) {
    mostVotes = Object.keys(votes).reduce((a, b) =>
      votes[a] > votes[b] ? a : b
    );
  }

  return (
    <div>
      <h2>Anecdotes of the day</h2>
      <p className="anecdote">{anecdotes[selected]}</p>
      <p>Has {votes[selected] ? votes[selected] : "0"} votes.</p>
      <div>
        <button onClick={handleClickVote}>Vote</button>
        <button onClick={handleClickNext}>Next anecdote</button>
      </div>
      <h2>Anecdote with most votes</h2>
      {conditionVotes > 0 && (
        <>
          <p>{anecdotes[mostVotes]}</p>
          <p>Has {votes[mostVotes]} votes.</p>
        </>
      )}
    </div>
  );
}

export default App;
