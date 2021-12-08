import React from "react";

export default function Total({ parts }) {
  let sum = parts.reduce((accumulator, item) => {
    return accumulator + item.exercises;
  }, 0);

  return <p>Number of exercises {sum}</p>;
}
