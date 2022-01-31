import React from "react";

const BlogSubpage = ({ blog, handleLike, handleRemove, username }) => {
  if (!blog) {
    return null;
  }
  // console.log(blog.comments);

  const own = username === blog.user.username;

  return (
    <div>
      <h2>{blog.title}</h2>
      <div>
        <div>{blog.url}</div>
        <div>
          likes {blog.likes}{" "}
          <button onClick={() => handleLike(blog.id)}>like</button>
        </div>
        <div>added by {blog.user.name}</div>
        {own && <button onClick={() => handleRemove(blog.id)}>remove</button>}
        <h3>Comments</h3>
        {blog.comments.length ? (
          <ul>
            {blog.comments.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ) : (
          <div>No comments found...</div>
        )}
      </div>
    </div>
  );
};

export default BlogSubpage;
