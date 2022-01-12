import React, { useState } from "react";
import AnecdoteForm from "./components/AnecdoteForm";
import AnecdoteList from "./components/AnecdoteList";
import Notification from "./components/Notification";

const App = () => {
  const [notification, setNotification] = useState(null);

  // Create a notification
  const addNotification = (message) => {
    setNotification({ message });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  return (
    <div>
      <h2>Anecdotes</h2>
      <AnecdoteList />
      <AnecdoteForm addNotification={addNotification} />
      <br />
      {<Notification notification={notification} />}
    </div>
  );
};

export default App;
