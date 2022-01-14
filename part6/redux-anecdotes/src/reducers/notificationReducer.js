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

export const showNotification = (notification) => {
  return {
    type: "SET_NOTIFICATION",
    notification,
  };
};

export const hideNotification = () => {
  return {
    type: "HIDE_NOTIFICATION",
    notification: null,
  };
};

export default notificationReducer;
