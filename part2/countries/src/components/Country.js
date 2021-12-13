import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Country({ country }) {
  const [weather, setWeather] = useState();

  // Weather API call
  useEffect(() => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${country.capital[0]}&appid=${process.env.REACT_APP_API_KEY}&units=metric`
      )
      .then((response) => setWeather(response.data));
  }, [country.capital]);

  function windDirection(num) {
    let val = Math.floor(num / 22.5 + 0.5);
    let arr = [
      "N",
      "NNE",
      "NE",
      "ENE",
      "E",
      "ESE",
      "SE",
      "SSE",
      "S",
      "SSW",
      "SW",
      "WSW",
      "W",
      "WNW",
      "NW",
      "NNW",
    ];
    return arr[val % 16];
  }

  return (
    <>
      <h2>{country.name.common}</h2>
      <p>Capital {country.capital[0]}</p>
      <p>Population {country.population.toLocaleString()}</p>
      <h3>Languages</h3>
      <ul>
        {Object.values(country.languages).map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt="flag" />
      <h3>Weather in {country.capital[0]}</h3>
      {weather && (
        <>
          <p>
            <strong>
              Temperature: {Math.round(weather.main.temp * 100) / 100} Celsius
            </strong>
          </p>
          <img
            src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="weather"
          />
          <p>{weather.weather[0].main}</p>
          <p>
            <strong>
              Wind: {weather.wind.speed} kph direction{" "}
              {windDirection(weather.wind.deg)}
            </strong>
          </p>
        </>
      )}
    </>
  );
}
