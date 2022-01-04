import React from "react";
import Blog from "./Blog";

export const BlogsList = ({ user, blogs }) => {
  return (
    <div>
      <h2>blogs</h2>
      <p>{user.name} logged in</p>
      <div>
        {blogs.map((blog) => (
          <Blog key={blog.id} blog={blog} />
        ))}
      </div>
    </div>
  );
};
