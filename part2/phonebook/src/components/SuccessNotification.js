import React from "react";

export default function SuccessNotification({ message }) {
  const notification =
    message === null ? null : <div className="successMessage">{message}</div>;

  return <>{notification}</>;
}
