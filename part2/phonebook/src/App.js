import React, { useState, useEffect } from "react";
import personService from "./services/persons";
import "./App.css";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";

function App() {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");

  // Get data from JSON server and store it into state
  useEffect(() => {
    // console.log("effect");
    personService.getAll().then((initalPersons) => {
      // console.log("Fulfilled");
      setPersons(initalPersons);
    });
  }, []);
  // console.log("render", persons.length, "persons");

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
      // Let server deal with creating IDs
      // id: persons.length + 1,
    };

    // Prevent the user from being able to add names that already exist in the phonebook
    const preventDuplicates = persons.every(
      (person) => person.name.toLowerCase() !== newName.toLowerCase()
    );

    if (preventDuplicates) {
      // Add new person to the server
      personService.create(newPerson).then((newNote) => {
        setPersons((prevPersons) => [...prevPersons, newNote]);
        setNewName("");
        setNewNumber("");
      });
    } else {
      alert(`${newName} is already added to phonebook.`);
    }
  }

  // Extract the code that handles the communication with the backend into its own module by following the example shown earlier in this part of the course material.

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
