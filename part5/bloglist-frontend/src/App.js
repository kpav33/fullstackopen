import React, { useState, useEffect, useRef } from "react";
import blogService from "./services/blogs";
import loginService from "./services/login";
import { LoginForm } from "./components/LoginForm";
// import { BlogsList } from "./components/BlogsList";
import { Notification } from "./components/Notification";
import Blog from "./components/Blog";
import { BlogForm } from "./components/BlogForm";
import { Togglable } from "./components/Togglable";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [notification, setNotification] = useState(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [user, setUser] = useState(null);

  const blogFormRef = useRef();

  // Get all blogs from database
  useEffect(() => {
    // blogService.getAll().then((blogs) => setBlogs(blogs));
    const fetchData = async () => {
      const data = await blogService.getAll();
      setBlogs(data);
    };
    fetchData();
  }, []);

  // Check if credentials for logged in user are already stored in local storage
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  // Display a notification
  function addNotification(message, type = "success") {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  }

  // Handle logging into the application
  const handleLogin = async (event) => {
    event.preventDefault();
    console.log("Logged in with ", username, password);

    try {
      const user = await loginService.login({ username, password });

      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));

      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      addNotification("wrong username or password", "error");
      console.log(exception);
    }
  };

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

  // Update a blog
  const updateBlog = async (updatedBlog) => {
    try {
      // Do a live update of the blog order as the like number is changed
      setBlogs((prevState) => {
        const filter = prevState.filter((blog) => blog.id !== updatedBlog.id);
        return [...filter, updatedBlog];
      });
      await blogService.update(updatedBlog.id, updatedBlog);
      // addNotification(
      //   `blog ${updatedBlog.title} by ${updatedBlog.author} updated`
      // );
    } catch (exception) {
      addNotification("failed to update the blog", "error");
      console.log(exception);
    }
  };

  // Delete a blog
  const deleteBlog = async (deletedBlog) => {
    if (
      window.confirm(
        `Remove blog ${deletedBlog.title} by ${deletedBlog.author} ?`
      )
    ) {
      try {
        await blogService.remove(deletedBlog.id);
        setBlogs((prevState) =>
          prevState.filter((blog) => blog.id !== deletedBlog.id)
        );
        addNotification(
          `blog ${deletedBlog.title} by ${deletedBlog.author} has been deleted`
        );
      } catch (exception) {
        addNotification("failed to delete the blog", "error");
        console.log(exception);
      }
    }
  };

  return (
    <div>
      {user === null ? (
        <LoginForm
          handleSubmit={handleLogin}
          username={username}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          password={password}
          handlePasswordChange={({ target }) => setPassword(target.value)}
        />
      ) : (
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
            {blogs
              .sort((a, b) => b.likes - a.likes)
              .map((blog) => (
                <Blog
                  key={blog.id}
                  blog={blog}
                  user={user}
                  updateBlog={updateBlog}
                  deleteBlog={deleteBlog}
                />
              ))}
          </div>
        </div>
      )}
      <br />
      <Notification notification={notification} />
    </div>
  );
};

export default App;
