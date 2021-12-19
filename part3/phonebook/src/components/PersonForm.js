import React from "react";

export default function PersonForm({
  handleFormSubmit,
  newName,
  handleNameChange,
  newNumber,
  handleNumberChange,
}) {
  return (
    <form onSubmit={handleFormSubmit}>
      <div>
        name: <input value={newName} onChange={handleNameChange} name="name" />
      </div>
      <br />
      <div>
        number:{" "}
        <input value={newNumber} onChange={handleNumberChange} name="number" />
      </div>
      <br />
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
}
