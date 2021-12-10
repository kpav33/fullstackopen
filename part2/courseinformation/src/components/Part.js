import React from "react";

export default function Part(props) {
  return (
    <p>
      {props.part.name} {props.part.exercises}
    </p>
  );
}
