import React from "react";

export default function SuccessNotification({ notification }) {
  // Instead of using two seperate ErrorNotification and SuccessNotification components, this is a combined component that works in the same way

  const notificationDiv =
    notification === null ? null : (
      <div className={notification.type}>{notification.message}</div>
    );

  return <>{notificationDiv}</>;
}
