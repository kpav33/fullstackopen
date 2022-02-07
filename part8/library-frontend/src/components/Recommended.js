import React, { useState, useEffect } from "react";
import { useQuery, useLazyQuery } from "@apollo/client";
import { ME, FILTERED_BOOKS } from "../queries";

const Recommended = ({ show }) => {
  const result = useQuery(ME);
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [getFilteredBooks, resultFiltered] = useLazyQuery(FILTERED_BOOKS);

  useEffect(() => {
    if (resultFiltered.data) {
      setRecommendedBooks(resultFiltered.data.allBooks);
    }
  }, [resultFiltered.data]);

  useEffect(() => {
    if (result.data) {
      getFilteredBooks({ variables: { genre: result.data.me.favoriteGenre } });
    }
  }, [getFilteredBooks, result.data]);

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
