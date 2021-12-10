import React from "react";
import Header from "./Header";
import Content from "./Content";
import Total from "./Total";

export default function Course({ courses }) {
  let coursesArray = courses.map((item) => (
    <div key={item.id}>
      <Header course={item} />
      <Content course={item} />
      <Total course={item} />
    </div>
  ));

  return <>{coursesArray}</>;
}
