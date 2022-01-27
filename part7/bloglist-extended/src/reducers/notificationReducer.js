const notificationReducer = (state = { notification: null }, action) => {
  switch (action.type) {
    case "SET_NOTIFICATION":
      return { notification: action.data };
    case "HIDE_NOTIFICATION":
      return { notification: action.data };
    default:
      return state;
  }
};

let timerId;

export const showNotification = (notification) => {
  return async (dispatch) => {
    dispatch({
      type: "SET_NOTIFICATION",
      data: {
        message: notification.message,
        type: notification.type,
      },
    });

    clearTimeout(timerId);

    timerId = setTimeout(() => {
      dispatch({
        type: "HIDE_NOTIFICATION",
        data: null,
      });
    }, 5000);
  };
};

export default notificationReducer;
