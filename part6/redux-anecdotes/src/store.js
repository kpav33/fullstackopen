import { createStore, combineReducers } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import anecdoteReducer from "./reducers/anecdoteReducer";
import notificationReducer from "./reducers/notificationReducer";
// import { notificationChange } from "./reducers/notificationReducer";

const reducer = combineReducers({
  anecdotes: anecdoteReducer,
  notification: notificationReducer,
});

const store = createStore(reducer, composeWithDevTools());

// console.log(store.getState());
// store.dispatch(notificationChange("OK"));
// console.log(store.getState());

export default store;
