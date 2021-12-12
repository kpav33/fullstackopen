import React, { useState } from "react";
import "./App.css";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";

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

    if (preventDuplicates) {
      setPersons((prevPersons) => [...prevPersons, newPerson]);
      setNewName("");
      setNewNumber("");
    } else {
      alert(`${newName} is already added to phonebook.`);
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} handleFilterChange={handleFilterChange} />

      <h2>Add a new</h2>
      <PersonForm
        handleFormSubmit={handleFormSubmit}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <h2>Numbers</h2>
      <Persons persons={persons} filter={filter} />
    </div>
  );
}

export default App;
