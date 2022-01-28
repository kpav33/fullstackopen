import loginService from "../services/login";
import storage from "../utils/storage";
import { showNotification } from "./notificationReducer";

const loginReducer = (state = null, action) => {
  switch (action.type) {
    case "INIT_USER":
      return action.data;
    case "LOGIN":
      return action.data;
    case "LOGOUT":
      return action.data;
    default:
      return state;
  }
};

export const initializeUser = () => {
  return async (dispatch) => {
    const user = storage.loadUser();
    if (user) {
      dispatch({
        type: "INIT_USER",
        data: user,
      });
    } else {
      dispatch({
        type: "INIT_USER",
        data: null,
      });
    }
  };
};

export const login = (user) => {
  return async (dispatch) => {
    try {
      const loggedInUser = await loginService.login(user);
      dispatch({ type: "LOGIN", data: loggedInUser });
      storage.saveUser(loggedInUser);
      dispatch(
        showNotification({
          message: `${user.username} welcome back!`,
          type: "success",
        })
      );
    } catch (exception) {
      console.log(exception);
      dispatch(
        showNotification({ message: "wrong username/password", type: "error" })
      );
    }
  };
};

export const logout = () => {
  return async (dispatch) => {
    storage.logoutUser();
    dispatch({ type: "LOGOUT", data: null });
  };
};

export default loginReducer;
