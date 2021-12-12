import React, { useState } from "react";
import "./App.css";

function App() {
  const [persons, setPersons] = useState([{ name: "Arto Hellas" }]);
  const [newName, setNewName] = useState("");

  function handleInputChange(event) {
    setNewName(event.target.value);
  }

  function handleFormSubmit(event) {
    event.preventDefault();
    const newPerson = {
      name: newName,
    };

    // Prevent the user from being able to add names that already exist in the phonebook
    const preventDuplicates = persons.every(
      (person) => person.name.toLowerCase() !== newName.toLowerCase()
    );
    // console.log(preventDuplicates);

    if (preventDuplicates) {
      setPersons((prevPersons) => [...prevPersons, newPerson]);
      setNewName("");
    } else {
      alert(`${newName} is already added to phonebook.`);
    }
  }

  const personsDisplay = persons.map((person) => (
    <p key={person.name}>{person.name}</p>
  ));

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={handleFormSubmit}>
        <div>
          name: <input value={newName} onChange={handleInputChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {personsDisplay}
      <div>debug: {newName}</div>
    </div>
  );
}

export default App;
