import React, { useState, useEffect } from "react";
import personService from "./services/persons";
import "./App.css";
// import SuccessNotification from "./components/SuccessNotification";
// import ErrorNotification from "./components/ErrorNotification";
import Notification from "./components/Notification";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import "./App.css";

function App() {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  // const [successNotification, setSuccessNotification] = useState(null);
  // const [errorNotification, setErrorNotification] = useState(null);
  const [notification, setNotification] = useState(null);

  // Get data from JSON server and store it into state
  useEffect(() => {
    // console.log("effect");
    personService
      .getAll()
      .then((initalPersons) => {
        // console.log("Fulfilled");
        setPersons(initalPersons);
      })
      .catch((error) => {
        // Show error message on error
        // setErrorNotification(
        //   `There was an error when trying to fetch data from the server. Try again later.`
        // );
        // setTimeout(() => {
        //   setErrorNotification(null);
        // }, 3000);
        addNotification(
          "There was an error when trying to fetch data from the server. Try again later.",
          "error"
        );
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

  // This function was added later after submitting my original solution (check commits and commented out code for original)
  // Show the notification
  function addNotification(message, type = "success") {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  }

  // Handle deleting a person
  function handleDeletePerson(id, name) {
    if (window.confirm(`Delete ${name}?`)) {
      personService
        .deletePerson(id)
        .then(() => {
          setPersons((prevPersons) =>
            prevPersons.filter((person) => person.id !== id)
          );
        })
        .catch((error) => {
          // Show error message on error
          // setErrorNotification(
          //   `There was an error when trying to delete ${name} from the server. Try again later.`
          // );
          // setTimeout(() => {
          //   setErrorNotification(null);
          // }, 3000);
          addNotification(
            `There was an error when trying to delete ${name} from the server. Try again later.`,
            "error"
          );
        });
    }
  }

  // Handle form submitting
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
      personService
        .create(newPerson)
        .then((newNote) => {
          // Show notification on added person
          // setSuccessNotification(`Added ${newNote.name}`);
          // setTimeout(() => {
          //   setSuccessNotification(null);
          // }, 3000);
          addNotification(`Added ${newNote.name}`);
          // Display updated persons and reset state
          setNewName("");
          setNewNumber("");
          setPersons((prevPersons) => [...prevPersons, newNote]);
        })
        .catch((error) => {
          // Show error message on error
          // setErrorNotification(
          //   `There was an error when adding ${newPerson.name} to the server. Try again later.`
          // );
          // setTimeout(() => {
          //   setErrorNotification(null);
          // }, 3000);
          // addNotification(
          //   `There was an error when adding ${newPerson.name} to the server. Try again later.`,
          //   "error"
          // );
          // console.log(error.response.data);
          addNotification(`${error.response.data.error}`, "error");
        });
    } else {
      if (
        window.confirm(
          `${newName} is already added to the phonebook, replace the old number with the new one?`
        )
      ) {
        // Update the phone number for selected person
        const findPerson = persons.find(
          (person) => person.name.toLowerCase() === newPerson.name.toLowerCase()
        );
        const changedPerson = { ...findPerson, number: newNumber };
        personService
          .update(findPerson.id, changedPerson)
          .then((updatedPerson) => {
            // Show notification on number change
            // setSuccessNotification(`Changed number for ${updatedPerson.name}`);
            // setTimeout(() => {
            //   setSuccessNotification(null);
            // }, 3000);
            addNotification(`Changed number for ${updatedPerson.name}`);
            // Display updated persons
            setPersons((prevPersons) =>
              prevPersons.map((person) =>
                person.id !== findPerson.id ? person : updatedPerson
              )
            );
          })
          .catch((error) => {
            // Show error message on error
            // setErrorNotification(
            //   `Information of ${changedPerson.name} has already been removed from server.`
            // );
            // setTimeout(() => {
            //   setErrorNotification(null);
            // }, 3000);
            if (error.response.status === 400) {
              console.log(error.response.data);
              addNotification(`${error.response.data.error}`, "error");
            } else {
              addNotification(
                `Information of ${changedPerson.name} has already been removed from server.`,
                "error"
              );
              setPersons((prevPersons) =>
                prevPersons.filter((person) => person.id !== findPerson.id)
              );
            }
          });
      } else {
        alert(`${newName} is already added to phonebook.`);
      }
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      {/* <SuccessNotification message={successNotification} />
      <ErrorNotification message={errorNotification} /> */}
      <Notification notification={notification} />
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
      <Persons
        persons={persons}
        filter={filter}
        handleDeletePerson={handleDeletePerson}
      />
    </div>
  );
}

export default App;
