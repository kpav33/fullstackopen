import React from "react";
import PropTypes from "prop-types";

export const Notification = ({ notification }) => {
  const notificationDiv =
    notification === null ? null : (
      <div className={notification.type}>{notification.message}</div>
    );

  return <>{notificationDiv}</>;
};

Notification.propTypes = {
  notification: PropTypes.object,
};
