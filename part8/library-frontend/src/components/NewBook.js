import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
  CREATE_BOOK,
  ALL_BOOKS,
  ALL_AUTHORS,
  FILTERED_BOOKS,
  ME,
} from "../queries";

const NewBook = ({ show, setError }) => {
  const result = useQuery(ME);
  const [favoriteGenre, setFavoriteGenre] = useState("");

  useEffect(() => {
    if (result.data) {
      setFavoriteGenre(result.data.me.favoriteGenre);
    }
  }, [result.data]);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [published, setPublished] = useState("");
  const [genre, setGenre] = useState("");
  const [genres, setGenres] = useState([]);

  // Refetch some queries when a new book is added, to keep graphQL cache in sync with the backend
  const [createBook] = useMutation(CREATE_BOOK, {
    refetchQueries: [
      { query: ALL_BOOKS },
      { query: ALL_AUTHORS },
      {
        query: FILTERED_BOOKS,
        variables: { genre: favoriteGenre },
      },
    ],
    onError: (error) => {
      setError(error.graphQLErrors[0].message);
    },
  });

  if (!show) {
    return null;
  }

  const submit = async (event) => {
    event.preventDefault();

    createBook({ variables: { title, author, published, genres } });

    setTitle("");
    setPublished("");
    setAuthor("");
    setGenres([]);
    setGenre("");
  };

  const addGenre = () => {
    setGenres(genres.concat(genre));
    setGenre("");
  };

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(parseInt(target.value))}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(" ")}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  );
};

export default NewBook;
