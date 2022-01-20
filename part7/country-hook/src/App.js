import React, { useState, useEffect } from "react";
import axios from "axios";

const useField = (type) => {
  const [value, setValue] = useState("");

  const onChange = (event) => {
    setValue(event.target.value);
  };

  return {
    type,
    value,
    onChange,
  };
};

const useCountry = (name) => {
  const [country, setCountry] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(
          `https://restcountries.com/v3.1/name/${name}?fullText=true`
        );
        setCountry(response.data[0]);
      } catch (error) {
        setCountry(null);
        console.log(error);
      }
    };
    getData();
  }, [name]);

  if (name === "") {
    return null;
  }

  if (!country) {
    return [];
  }

  return country;
};

const Country = ({ country }) => {
  if (!country) {
    return null;
  }

  const component =
    country.length === 0 ? (
      <div>Not found</div>
    ) : (
      <div>
        <h3>{country.name.common} </h3>
        <div>capital {country.capital[0]} </div>
        <div>population {country.population.toLocaleString()}</div>
        <img
          src={country.flags.png}
          height="100"
          alt={`flag of ${country.name.common}`}
        />
      </div>
    );

  return component;
};

const App = () => {
  const nameInput = useField("text");
  const [name, setName] = useState("");
  const country = useCountry(name);

  const fetch = (e) => {
    e.preventDefault();
    setName(nameInput.value);
  };

  return (
    <div>
      <form onSubmit={fetch}>
        <input {...nameInput} />
        <button>find</button>
      </form>

      <Country country={country} />
    </div>
  );
};

export default App;
