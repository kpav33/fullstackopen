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

// Fix notification not showing up for the appropriate time bug, by using clearTimeout()
let timerId;

export const showNotification = (notification, displayTime) => {
  const displayTimeMiliSeconds = displayTime * 1000;

  return async (dispatch) => {
    dispatch({
      type: "SET_NOTIFICATION",
      notification,
    });

    // console.log("TIMER ", timerId);
    clearTimeout(timerId);

    timerId = setTimeout(() => {
      // console.log("TIMER ", timerId);
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
