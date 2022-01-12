import React from "react";

const Notification = ({ notification }) => {
  const style = {
    border: "solid",
    padding: 10,
    borderWidth: 1,
  };

  const notificationDiv =
    notification === null ? null : (
      <div style={style}>{notification.message}</div>
    );

  return <>{notificationDiv}</>;
};

export default Notification;
