import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { ALL_AUTHORS, EDIT_AUTHOR } from "../queries";

const Authors = ({ show, setError, token }) => {
  const result = useQuery(ALL_AUTHORS);
  const [name, setName] = useState("");
  const [setBornTo, setBornYear] = useState("");

  const [changeAuthor, resultChange] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  useEffect(() => {
    if (resultChange.data && resultChange.data.editAuthor === null) {
      setError("person not found");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resultChange.data]);

  if (!show) {
    return null;
  }

  if (result.loading) {
    return <div>loading...</div>;
  }

  const submit = (event) => {
    event.preventDefault();
    changeAuthor({ variables: { name, setBornTo } });

    setName("");
    setBornYear("");
  };

  const handleChange = (event) => {
    setName(event.target.value);
  };

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {result.data.allAuthors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {token && (
        <>
          <h3>Set birthyear</h3>
          <form onSubmit={submit}>
            {/* <div>
          name
          <input
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div> */}
            <select defaultValue={name} onChange={handleChange}>
              {/* <option value="Robert Martin">Grapefruit</option>
          <option value="Martin Fowler">Lime</option>
          <option value="Sandi Metz">Coconut</option>
          <option value="Joshua Kerievsky">Joshua Kerievsky</option> */}
              {result.data.allAuthors.map((author) => (
                <option key={author.name} value={author.name}>
                  {author.name}
                </option>
              ))}
            </select>
            <div>
              born
              <input
                value={setBornTo}
                onChange={({ target }) => setBornYear(parseInt(target.value))}
              />
            </div>
            <button type="submit">update author</button>
          </form>
        </>
      )}
    </div>
  );
};

export default Authors;
