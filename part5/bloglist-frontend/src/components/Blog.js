import React, { useState } from "react";
import blogService from "../services/blogs";

const Blog = ({ blog, setBlogs }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [blogObject, setBlogObject] = useState(blog);

  const handleShowDetails = () => {
    setShowDetails((prevState) => !prevState);
  };

  const handleLikeClick = async () => {
    console.log("OK");
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

    const response = await blogService.update(blog.id, updatedBlog);

    // const data = await blogService.getAll();
    // setBlogs(data);
    // console.log(data);
    // console.log(response);
  };

  const blogStyle = {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  // console.log(blog);

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
        </div>
      )}
    </div>
  );
};

export default Blog;
