import React from "react";

const BlogSubpage = ({ blog, handleLike, handleRemove, username }) => {
  if (!blog) {
    return null;
  }

  const own = username === blog.user.username;

  return (
    <div>
      <h2>{blog.title}</h2>
      <div>
        <div>{blog.url}</div>
        <div>
          likes {blog.likes}
          <button onClick={() => handleLike(blog.id)}>like</button>
        </div>
        <div>{blog.user.name}</div>
        {own && <button onClick={() => handleRemove(blog.id)}>remove</button>}
      </div>
    </div>
  );
};

export default BlogSubpage;
