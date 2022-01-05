import React, { useRef } from "react";
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
  const blogFormRef = useRef();

  // Log out and clear local storage
  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogappUser");
    setUser(null);
    addNotification("successfully logged out of the application");
  };

  // Add a new blog
  const addBlog = async (newBlog) => {
    try {
      blogFormRef.current.toggleVisibility();
      const returnedBlog = await blogService.create(newBlog);
      setBlogs((prevBlogs) => [...prevBlogs, returnedBlog]);
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
        <BlogForm createBlog={addBlog} />
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
