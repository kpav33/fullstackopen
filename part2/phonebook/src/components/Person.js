import React from "react";

export default function Person({ name, number, id, handleDeletePerson }) {
  return (
    <>
      <p>
        {name} {number}
      </p>
      <button onClick={() => handleDeletePerson(id, name)}>Delete</button>
    </>
  );
}
