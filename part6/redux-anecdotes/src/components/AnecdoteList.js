import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { voteFor } from "../reducers/anecdoteReducer";

const AnecdoteList = ({ addNotification }) => {
  // const anecdotes = useSelector((state) => state.anecdotes);
  const anecdotes = useSelector((state) => {
    if (state.filter) {
      const filteredAnecdotes = state.anecdotes.filter((item) =>
        item.content.toLowerCase().includes(state.filter.toLowerCase())
      );
      return filteredAnecdotes;
    }
    return state.anecdotes;
  });

  const dispatch = useDispatch();

  const vote = (object) => {
    // console.log("vote", object.id);
    dispatch(voteFor(object));
    const anecdote = anecdotes.find((n) => n.id === object.id);
    addNotification(`You voted for "${anecdote.content}"`);
  };

  return (
    <div>
      {anecdotes
        .sort((a, b) => b.votes - a.votes)
        .map((anecdote) => (
          <div key={anecdote.id}>
            <div>{anecdote.content}</div>
            <div>
              has {anecdote.votes}{" "}
              <button onClick={() => vote(anecdote)}>vote</button>
            </div>
          </div>
        ))}
    </div>
  );
};

export default AnecdoteList;
