import React from "react";
import { useDispatch } from "react-redux";
import { createAnecdote } from "../reducers/anecdoteReducer";
// import { connect } from "react-redux";

const AnecdoteForm = ({ addNotification }) => {
  const dispatch = useDispatch();

  const addAnecdote = async (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    event.target.anecdote.value = "";
    // dispatch(createAnecdote(content));
    // const newAnecdote = await anecdoteService.createNew(content);
    // dispatch(createAnecdote(newAnecdote));
    dispatch(createAnecdote(content));
    addNotification(`${content} added to the anecdotes list`);
  };

  return (
    <>
      <h2>create new</h2>

      <form onSubmit={addAnecdote}>
        <div>
          <input name="anecdote" />
        </div>
        <button type="submit">create</button>
      </form>
    </>
  );
};

export default AnecdoteForm;

// Use redux with the connect function (alternative option to using the Redux Hooks API)

// const AnecdoteForm = (props) => {
//   const addAnecdote = async (event) => {
//     event.preventDefault();
//     const content = event.target.anecdote.value;
//     event.target.anecdote.value = "";
//     props.createAnecdote(content);
//     props.addNotification(`${content} added to the anecdotes list`);
//   };

//   return (
//     <>
//       <h2>create new</h2>

//       <form onSubmit={addAnecdote}>
//         <div>
//           <input name="anecdote" />
//         </div>
//         <button type="submit">create</button>
//       </form>
//     </>
//   );
// };

// const mapDispatchToProps = {
//   createAnecdote,
// };

// const ConnectedAnecdoteForm = connect(null, mapDispatchToProps)(AnecdoteForm);
// export default ConnectedAnecdoteForm;
