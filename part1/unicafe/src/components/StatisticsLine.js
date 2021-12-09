import React from "react";

export default function StatisticsLine({ text, value }) {
  return (
    <tr>
      {/* {text} {value} {text === "Positive" && "%"} */}
      <th>{text}</th>
      <td>
        {value}
        {text === "Positive" && " %"}
      </td>
    </tr>
  );
}
