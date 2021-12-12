import React from "react";
import Person from "./Person";

export default function Persons({ persons, filter }) {
  const personsDisplay = persons
    .filter((person) =>
      person.name.toLowerCase().includes(filter.toLowerCase())
    )
    .map((person) => (
      <Person key={person.id} name={person.name} number={person.number} />
    ));

  return <div>{personsDisplay}</div>;
}
