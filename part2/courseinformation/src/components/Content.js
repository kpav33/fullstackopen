import React from "react";
import Part from "./Part";

export default function Content({ course }) {
  let coursePartsArray = course.parts.map((part) => (
    <Part key={part.id} part={part} />
  ));

  return <div>{coursePartsArray}</div>;
}
