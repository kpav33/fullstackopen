import React, { useState } from "react";
import "./App.css";

function App() {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "040-123456" },
  ]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");

  function handleNameChange(event) {
    setNewName(event.target.value);
  }

  function handleNumberChange(event) {
    setNewNumber(event.target.value);
  }

  function handleFormSubmit(event) {
    event.preventDefault();
    const newPerson = {
      name: newName,
      number: newNumber,
    };

    // Prevent the user from being able to add names that already exist in the phonebook
    const preventDuplicates = persons.every(
      (person) => person.name.toLowerCase() !== newName.toLowerCase()
    );
    // console.log(preventDuplicates);

    if (preventDuplicates) {
      setPersons((prevPersons) => [...prevPersons, newPerson]);
      setNewName("");
      setNewNumber("");
    } else {
      alert(`${newName} is already added to phonebook.`);
    }
  }

  const personsDisplay = persons.map((person) => (
    <p key={person.name}>
      {person.name} {person.number}
    </p>
  ));

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={handleFormSubmit}>
        <div>
          name:{" "}
          <input value={newName} onChange={handleNameChange} name="name" />
        </div>
        <br />
        <div>
          number:{" "}
          <input
            value={newNumber}
            onChange={handleNumberChange}
            name="number"
          />
        </div>
        <br />
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {personsDisplay}
      <div>debug: {newNumber}</div>
    </div>
  );
}

export default App;
