import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { ME, ALL_BOOKS } from "../queries";

const Recommended = ({ show }) => {
  const result = useQuery(ME);
  const resultBooks = useQuery(ALL_BOOKS);
  const [recommendedBooks, setRecommendedBooks] = useState([]);

  useEffect(() => {
    if (resultBooks.data && result.data) {
      const books = resultBooks.data.allBooks;
      const filteredBooks = books.filter((book) =>
        book.genres.includes(result.data.me.favoriteGenre)
      );
      setRecommendedBooks(filteredBooks);
    }
  }, [resultBooks.data, result.data]);

  if (!show) {
    return null;
  }

  if (result.loading) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <p>
        Books in your favorite genre{" "}
        <strong>{result.data.me.favoriteGenre}</strong>
      </p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {recommendedBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Recommended;
