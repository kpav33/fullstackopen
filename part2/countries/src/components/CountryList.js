import React from "react";

export default function CountryList({ countriesFiltered, handleClick }) {
  let displayCountries =
    countriesFiltered.length < 10
      ? countriesFiltered.length === 0
        ? "No countries found"
        : countriesFiltered.map((country) => (
            <div key={country.name.common}>
              <p>{country.name.common}</p>
              <button onClick={() => handleClick(country.name.common)}>
                Show
              </button>
            </div>
          ))
      : "Too many matches, specify another filter";

  return <>{displayCountries}</>;
}
