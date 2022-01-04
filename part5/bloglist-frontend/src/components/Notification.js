import React from "react";

export const Notification = ({ notification }) => {
  const notificationDiv =
    notification === null ? null : (
      <div className={notification.type}>{notification.message}</div>
    );

  return <>{notificationDiv}</>;
};
