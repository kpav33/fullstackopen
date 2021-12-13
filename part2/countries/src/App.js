import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [countries, setCountries] = useState([]);
  const [findCountries, setFindCountries] = useState("");

  // Get countries and store them into state
  useEffect(() => {
    axios
      .get("https://restcountries.com/v3.1/all")
      .then((response) => setCountries(response.data));
  }, []);

  function handleFindCountriesChange(event) {
    setFindCountries(event.target.value);
  }

  let countriesFiltered = countries.filter((country) =>
    country.name.common.toLowerCase().includes(findCountries.toLowerCase())
  );

  function handleClick(country) {
    setFindCountries(country);
  }

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

  let countryDetails = countriesFiltered.length > 0 && (
    <>
      <h2>{countriesFiltered[0].name.common}</h2>
      <p>Capital {countriesFiltered[0].capital[0]}</p>
      <p>Population {countriesFiltered[0].population.toLocaleString()}</p>
      <h3>Languages</h3>
      <ul>
        {Object.values(countriesFiltered[0].languages).map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img src={countriesFiltered[0].flags.png} alt="flag" />
    </>
  );

  return (
    <div>
      <h1>Countries</h1>
      <div>
        find countries
        <input
          value={findCountries}
          onChange={handleFindCountriesChange}
          name="find"
        />
      </div>
      <div>
        {countriesFiltered.length === 1 ? countryDetails : displayCountries}
      </div>
    </div>
  );
}

export default App;
