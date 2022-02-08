import React, { useState } from "react";
import { useApolloClient, useSubscription } from "@apollo/client";

import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Notify from "./components/Notify";
import Login from "./components/Login";
import Recommended from "./components/Recommended";
import { BOOK_ADDED, ALL_BOOKS } from "./queries";

const App = () => {
  const [page, setPage] = useState("authors");
  const [errorMessage, setErrorMessage] = useState(null);
  const [token, setToken] = useState(
    localStorage.getItem("library-user-token") || null
  );
  const client = useApolloClient();

  const notify = (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 5000);
  };

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
    setPage("authors");
  };

  const updateCacheWith = (addedBook) => {
    const includedIn = (set, object) =>
      set.map((p) => p.title).includes(object.title);

    const dataInStore = client.readQuery({ query: ALL_BOOKS });
    if (!includedIn(dataInStore.allBooks, addedBook)) {
      // console.log(dataInStore);
      client.writeQuery({
        query: ALL_BOOKS,
        data: { allBooks: dataInStore.allBooks.concat(addedBook) },
      });
      // console.log(dataInStore.allBooks.concat(addedBook));
      // console.log(client.readQuery({ query: ALL_BOOKS }));
      // client.refetchQueries({
      //   include: [ALL_BOOKS],
      // });
    }
  };

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded;
      // window.alert(`${book.title} added to the library!`);
      notify(`${addedBook.title} added to the library!`);
      updateCacheWith(addedBook);
    },
  });

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {!token && <button onClick={() => setPage("login")}>login</button>}
        {token && <button onClick={() => setPage("add")}>add book</button>}
        {token && (
          <button onClick={() => setPage("recommended")}>recommended</button>
        )}
        {token && <button onClick={logout}>logout</button>}
      </div>

      <Notify errorMessage={errorMessage} />

      <Authors show={page === "authors"} setError={notify} token={token} />

      <Books show={page === "books"} />

      {token && <Recommended show={page === "recommended"} />}

      <Login
        show={page === "login"}
        setToken={setToken}
        notify={notify}
        setPage={setPage}
      />

      {token && <NewBook show={page === "add"} setError={notify} />}
    </div>
  );
};

export default App;
