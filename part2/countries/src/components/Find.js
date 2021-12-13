import React from "react";

export default function Find({ findCountries, handleFindCountriesChange }) {
  return (
    <div>
      find countries
      <input
        value={findCountries}
        onChange={handleFindCountriesChange}
        name="find"
      />
    </div>
  );
}
