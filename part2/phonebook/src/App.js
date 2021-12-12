import React, { useState } from "react";
import "./App.css";

function App() {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "040-123456", id: 1 },
    { name: "Ada Lovelace", number: "39-44-5323523", id: 2 },
    { name: "Dan Abramov", number: "12-43-234345", id: 3 },
    { name: "Mary Poppendieck", number: "39-23-6423122", id: 4 },
  ]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");

  // console.log(persons);
  // console.log(filter);

  function handleNameChange(event) {
    setNewName(event.target.value);
  }

  function handleNumberChange(event) {
    setNewNumber(event.target.value);
  }

  function handleFilterChange(event) {
    setFilter(event.target.value);
  }

  function handleFormSubmit(event) {
    event.preventDefault();
    if (newName === "" || newNumber === "") {
      alert("Please fill all input fields!");
      return;
    }

    const newPerson = {
      name: newName,
      number: newNumber,
      id: persons.length + 1,
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

  const personsDisplay = persons
    .filter((person) =>
      person.name.toLowerCase().includes(filter.toLowerCase())
    )
    .map((person) => (
      <p key={person.id}>
        {person.name} {person.number}
      </p>
    ));

  // const personsDisplayFiltered = persons.filter((person) =>
  //   person.name.toLowerCase().includes(filter.toLowerCase())
  // );

  // console.log(personsDisplayFiltered);

  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        filter shown with{" "}
        <input value={filter} onChange={handleFilterChange} name="filter" />
      </div>
      <h2>Add a new</h2>
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
