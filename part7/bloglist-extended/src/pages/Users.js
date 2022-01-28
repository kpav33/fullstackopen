import React from "react";
import { useSelector } from "react-redux";

const Users = () => {
  const users = useSelector((state) => state.users);

  return (
    <div>
      <h2>Users</h2>
      <div style={{ marginLeft: "120px", marginBottom: "5px" }}>
        <strong>blogs created</strong>
      </div>
      {users
        .sort((a, b) => b.blogs.length - a.blogs.length)
        .map((user) => (
          <div key={user.id}>
            <span
              style={{
                display: "inline-block",
                width: "120px",
                height: "20px",
              }}
            >
              {user.name}
            </span>{" "}
            {user.blogs.length}
          </div>
        ))}
    </div>
  );
};

export default Users;
