import React, { useState, useEffect } from "react";
import axios from "axios";
import PromisePolyfill from "promise-polyfill";

if (!window.Promise) {
  window.Promise = PromisePolyfill;
}

const useNotes = (url) => {
  const [notes, setNotes] = useState([]);
  useEffect(() => {
    axios.get(url).then((response) => {
      setNotes(response.data);
    });
  }, [url]);
  return notes;
};

const App = () => {
  const [counter, setCounter] = useState(0);
  const [values, setValues] = useState([]);
  //   https://glacial-ravine-74819.herokuapp.com/api/notes
  //   https://blooming-atoll-75500.herokuapp.com/api/notes
  //   const url = "https://glacial-ravine-74819.herokuapp.com/api/notes";
  console.log(BACKEND_URL);
  const notes = useNotes(BACKEND_URL);

  const handleClick = () => {
    setCounter(counter + 1);
    setValues(values.concat(counter));
  };

  return (
    <div className="container">
      hello webpack {counter} clicks
      <button onClick={handleClick}>press</button>
      <div>
        {notes.length} notes on server {BACKEND_URL}
      </div>
    </div>
  );
};

export default App;
