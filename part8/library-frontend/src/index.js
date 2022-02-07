import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

// Add a token to the request header
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("library-user-token");
  return {
    headers: {
      ...headers,
      authorization: token ? `bearer ${token}` : null,
    },
  };
});
const httpLink = new HttpLink({ uri: "http://localhost:4000" });

// Connect to server by creating a client object
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
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
