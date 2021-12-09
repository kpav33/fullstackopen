import React from "react";

export default function Button({ selector, handleClick }) {
  return <button onClick={() => handleClick(selector)}>{selector}</button>;
}
