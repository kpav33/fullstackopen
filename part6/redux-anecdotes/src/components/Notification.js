import React from "react";
import { useSelector } from "react-redux";
// import { connect } from "react-redux";

const Notification = () => {
  const notification = useSelector((state) => state.notification);

  const style = {
    border: "solid",
    padding: 10,
    borderWidth: 1,
  };

  const notificationDiv =
    notification === null ? null : <div style={style}>{notification}</div>;

  return <>{notificationDiv}</>;
};

export default Notification;

// Use redux with the connect function (alternative option to using the Redux Hooks API)

// const Notification = (props) => {
//   const style = {
//     border: "solid",
//     padding: 10,
//     borderWidth: 1,
//   };

//   const notificationDiv =
//     props.notification === null ? null : (
//       <div style={style}>{props.notification}</div>
//     );

//   return <>{notificationDiv}</>;
// };

// const mapStateToProps = (state) => {
//   return {
//     notification: state.notification,
//   };
// };

// const ConnectedNotification = connect(mapStateToProps)(Notification);
// export default ConnectedNotification;
