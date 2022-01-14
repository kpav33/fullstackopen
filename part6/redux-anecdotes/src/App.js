import React from "react";
import AnecdoteForm from "./components/AnecdoteForm";
import AnecdoteList from "./components/AnecdoteList";
import Notification from "./components/Notification";
import { useDispatch } from "react-redux";
import {
  showNotification,
  hideNotification,
} from "./reducers/notificationReducer";

const App = () => {
  const dispatch = useDispatch();

  // Create a notification
  const addNotification = (message) => {
    dispatch(showNotification(message));
    setTimeout(() => {
      dispatch(hideNotification());
    }, 5000);
  };

  return (
    <div>
      <h2>Anecdotes</h2>
      {<Notification />}
      <br />
      <AnecdoteList addNotification={addNotification} />
      <AnecdoteForm addNotification={addNotification} />
    </div>
  );
};

export default App;
