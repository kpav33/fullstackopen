import React from "react";
import { Link } from "react-router-dom";

const Menu = () => {
  const style = {
    paddingRight: "5px",
  };

  return (
    <div style={{ display: "inline-block" }}>
      <Link to="/" style={style}>
        Blogs
      </Link>
      <Link to="/users" style={style}>
        Users
      </Link>
    </div>
  );
};

export default Menu;
