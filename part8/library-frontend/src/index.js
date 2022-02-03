import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";

// Connect to server by creating a client object
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({ uri: "http://localhost:4000" }),
});

// Example simple query sent to GraphQL server
// const query = gql`
//   query {
//     allAuthors {
//       name
//       born
//       bookCount
//     }
//   }
// `;

// client.query({ query }).then((response) => console.log(response.data));

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);
