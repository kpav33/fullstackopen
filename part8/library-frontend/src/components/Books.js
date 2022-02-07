import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { ALL_BOOKS } from "../queries";

const Books = ({ show }) => {
  const result = useQuery(ALL_BOOKS);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("all genres");
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);

  useEffect(() => {
    if (result.data) {
      setBooks(result.data.allBooks);
      const genres = result.data.allBooks.map((item) => item.genres);
      const genresFiltered = Array.from(
        new Set(genres.reduce((prev, cur) => prev.concat(cur)))
      );
      setGenres(["all genres", ...genresFiltered]);
    }
  }, [result.data]);

  useEffect(() => {
    if (selectedGenre === "all genres") {
      setFilteredBooks(books);
    } else {
      const filteredBooksByGenre = books.filter((book) =>
        book.genres.includes(selectedGenre)
      );
      setFilteredBooks(filteredBooksByGenre);
    }
  }, [books, selectedGenre]);

  if (!show) {
    return null;
  }

  if (result.loading) {
    return <div>loading...</div>;
  }

  const handleClick = (genre) => {
    setSelectedGenre(genre);
  };

  return (
    <div>
      <h2>books</h2>

      <p>
        In genre <strong>{selectedGenre}</strong>
      </p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {genres.length > 0 && (
        <div>
          {genres.map((item) => (
            <button key={item} onClick={() => handleClick(item)}>
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Books;
