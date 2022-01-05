import React, { useState, useRef } from "react";
import Blog from "./Blog";
import { BlogForm } from "./BlogForm";
import { Togglable } from "./Togglable";
import blogService from "../services/blogs";

export const BlogsList = ({
  user,
  setUser,
  blogs,
  setBlogs,
  addNotification,
}) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const blogFormRef = useRef();

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogappUser");
    setUser(null);
    addNotification("successfully logged out of the application");
  };

  const handleCreateBlog = async (event) => {
    event.preventDefault();

    const newBlog = {
      title: title,
      author: author,
      url: url,
    };

    try {
      blogFormRef.current.toggleVisibility();
      const returnedBlog = await blogService.create(newBlog);
      setBlogs((prevBlogs) => [...prevBlogs, returnedBlog]);
      setTitle("");
      setAuthor("");
      setUrl("");
      addNotification(
        `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`
      );
    } catch (exception) {
      addNotification(
        "failed to add a blog, make sure you filled out all of the fields",
        "error"
      );
      console.log(exception);
    }
  };

  return (
    <div>
      <h2>blogs</h2>
      <p>
        {user.name} logged in <button onClick={handleLogout}>Logout</button>
      </p>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm
          setBlogs={setBlogs}
          addNotification={addNotification}
          handleCreateBlog={handleCreateBlog}
          title={title}
          setTitle={setTitle}
          author={author}
          setAuthor={setAuthor}
          url={url}
          setUrl={setUrl}
        />
      </Togglable>
      <br />
      <div>
        {blogs.map((blog) => (
          <Blog key={blog.id} blog={blog} />
        ))}
      </div>
    </div>
  );
};
