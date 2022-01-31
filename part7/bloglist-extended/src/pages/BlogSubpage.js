import React from "react";
import Button from "react-bootstrap/Button";

const BlogSubpage = ({
  blog,
  handleLike,
  handleRemove,
  handleComment,
  username,
}) => {
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
          likes {blog.likes}{" "}
          <Button onClick={() => handleLike(blog.id)}>like</Button>
        </div>
        <div>added by {blog.user.name}</div>
        {own && <button onClick={() => handleRemove(blog.id)}>remove</button>}
        <h3>Comments</h3>
        <form onSubmit={() => handleComment(event, blog.id)}>
          <input id="comment" type="text" name="comment" />
          <Button>Add comment</Button>
        </form>
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
