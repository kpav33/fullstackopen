import React, { useState } from "react";
import blogService from "../services/blogs";

const Blog = ({ blog, setBlogs, user }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [blogObject, setBlogObject] = useState(blog);

  const handleShowDetails = () => {
    setShowDetails((prevState) => !prevState);
  };

  const handleLikeClick = async () => {
    const updatedBlog = {
      ...blogObject,
      likes: blogObject.likes + 1,
    };

    setBlogObject(updatedBlog);
    // Do a live update of the blog order as the like number is changed
    setBlogs((prevState) => {
      const filter = prevState.filter((blog) => blog.id !== updatedBlog.id);
      setBlogs([...filter, updatedBlog]);
    });

    await blogService.update(blog.id, updatedBlog);

    // const data = await blogService.getAll();
    // setBlogs(data);
    // console.log(data);
    // console.log(response);
  };

  const handleRemove = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author} ?`)) {
      try {
        await blogService.remove(blog.id);
        setBlogs((prevState) =>
          prevState.filter((blog) => blog.id !== blogObject.id)
        );
      } catch (exception) {
        console.log(exception);
      }
    }
  };

  const blogStyle = {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}{" "}
        <button onClick={handleShowDetails}>
          {showDetails ? "hide" : "view"}
        </button>
      </div>
      {showDetails && (
        <div>
          <p>
            <strong>URL: </strong>
            {blog.url}
          </p>
          <div>
            <p>
              <strong>Likes</strong> {blogObject.likes}
            </p>
            <button onClick={handleLikeClick}>Like</button>
          </div>
          <p>
            <strong>Author: </strong>
            {blog.author}
          </p>
          {user.username === blog.user.username && (
            <button onClick={handleRemove}>remove</button>
          )}
        </div>
      )}
    </div>
  );
};

export default Blog;
