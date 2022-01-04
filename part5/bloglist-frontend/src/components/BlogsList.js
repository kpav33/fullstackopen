import React, { useState } from "react";
import blogService from "../services/blogs";
import Blog from "./Blog";

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
      <div>
        <h2>create new blogs</h2>
        <form onSubmit={handleCreateBlog}>
          <div>
            title:
            <input
              type="text"
              value={title}
              name="title"
              onChange={({ target }) => setTitle(target.value)}
            />
          </div>
          <div>
            author:
            <input
              type="text"
              value={author}
              name="author"
              onChange={({ target }) => setAuthor(target.value)}
            />
          </div>
          <div>
            url:
            <input
              type="text"
              value={url}
              name="url"
              onChange={({ target }) => setUrl(target.value)}
            />
          </div>
          <button type="submit">Create</button>
        </form>
      </div>
      <br />
      <div>
        {blogs.map((blog) => (
          <Blog key={blog.id} blog={blog} />
        ))}
      </div>
    </div>
  );
};
