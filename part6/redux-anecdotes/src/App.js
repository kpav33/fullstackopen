import React, { useEffect } from "react";
import AnecdoteForm from "./components/AnecdoteForm";
import AnecdoteList from "./components/AnecdoteList";
import Notification from "./components/Notification";
import Filter from "./components/Filter";
import { useDispatch } from "react-redux";
import { showNotification } from "./reducers/notificationReducer";
import { initializeAnecdotes } from "./reducers/anecdoteReducer";

const App = () => {
  const dispatch = useDispatch();

  // Get initial anecdotes from the JSON server
  useEffect(() => {
    // Replaced with redux-thunk
    // anecdoteService
    //   .getAll()
    //   .then((anecdotes) => dispatch(initializeAnecdotes(anecdotes)));
    dispatch(initializeAnecdotes());
  }, [dispatch]);

  // Create a notification
  const addNotification = (message) => {
    // dispatch(showNotification(message));
    // setTimeout(() => {
    //   dispatch(hideNotification());
    // }, 5000);
    dispatch(showNotification(message, 5));
  };

  return (
    <div>
      <h2>Anecdotes</h2>
      {<Notification />}
      <br />
      <Filter />
      <AnecdoteList addNotification={addNotification} />
      <AnecdoteForm addNotification={addNotification} />
    </div>
  );
};

export default App;
