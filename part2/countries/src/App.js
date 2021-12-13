import React, { useState, useEffect } from "react";
import axios from "axios";
import Find from "./components/Find";
import Country from "./components/Country";
import CountryList from "./components/CountryList";

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

  // On show button click, set clicked coutry name as input value
  function handleClick(country) {
    setFindCountries(country);
  }

  return (
    <div>
      <h1>Countries</h1>
      <Find
        findCountries={findCountries}
        handleFindCountriesChange={handleFindCountriesChange}
      />
      <div>
        {countriesFiltered.length === 1 ? (
          <Country country={countriesFiltered[0]} />
        ) : (
          <CountryList
            countriesFiltered={countriesFiltered}
            handleClick={handleClick}
          />
        )}
      </div>
    </div>
  );
}

export default App;
