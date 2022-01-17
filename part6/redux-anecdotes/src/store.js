import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

import anecdoteReducer from "./reducers/anecdoteReducer";
import notificationReducer from "./reducers/notificationReducer";
import filterReducer from "./reducers/filterReducer";
// import { notificationChange } from "./reducers/notificationReducer";
// import anecdoteService from "./services/anecdotes";

const reducer = combineReducers({
  anecdotes: anecdoteReducer,
  notification: notificationReducer,
  filter: filterReducer,
});

const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)));

// anecdoteService
//   .getAll()
//   .then((anecdotes) =>
//     anecdotes.forEach((anecdote) =>
//       store.dispatch({ type: "NEW_ANECDOTE", data: anecdote })
//     )
//   );

// Same as above but simplified
// Moved to App.js
// anecdoteService
//   .getAll()
//   .then((anecdotes) => store.dispatch(initializeAnecdotes(anecdotes)));

// console.log(store.getState());
// store.dispatch(notificationChange("OK"));
// console.log(store.getState());

export default store;
