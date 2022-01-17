const notificationReducer = (state = null, action) => {
  switch (action.type) {
    case "SET_NOTIFICATION":
      return action.notification;
    case "HIDE_NOTIFICATION":
      return action.notification;
    default:
      return state;
  }
};

export const showNotification = (notification, displayTime) => {
  const displayTimeMiliSeconds = displayTime * 1000;

  return async (dispatch) => {
    dispatch({
      type: "SET_NOTIFICATION",
      notification,
    });

    setTimeout(() => {
      dispatch({
        type: "HIDE_NOTIFICATION",
        notification: null,
      });
    }, displayTimeMiliSeconds);
  };
  // return {
  //   type: "SET_NOTIFICATION",
  //   notification,
  // };
};

// Replaced by combining all logic in showNotification action creator by utisiling redux-thunk
// export const hideNotification = () => {
//   return {
//     type: "HIDE_NOTIFICATION",
//     notification: null,
//   };
// };

export default notificationReducer;
