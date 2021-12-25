# Part2

Let's continue our introduction to React. First, we will take a look at how to render a data collection, like a list of names, to the screen. After this, we will inspect how a user can submit data to a React application using HTML forms. Next, our focus shifts towards looking at how JavaScript code in the browser can fetch and handle data stored in a remote backend server. Lastly, we will take a quick look at a few simple ways of adding CSS styles to our React applications.

## Applications

There is one seperate React application built with Create React App in each of the folders.

```console
# Install dependencies
yarn install
# Start the application
yarn start
```

The `phonebook` applications requires a running `JSON server` that points to `db.json` file to work. To start the server install JSON server with npm and start it with `npx json-server --port 3001 --watch db.json`.

The `countries` application fetches data from the [https://restcountries.eu](https://restcountries.eu) API and for displaying weather data, [https://openweathermap.org/api](https://openweathermap.org/api) is used. The open weather API requires an active API key for it to work.