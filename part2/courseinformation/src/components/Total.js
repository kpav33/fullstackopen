import React from "react";

export default function Total({ course }) {
  const sum = course.parts.reduce((sum, item) => sum + item.exercises, 0);

  return (
    <p>
      <strong>Total of {sum} exercises.</strong>
    </p>
  );
}
