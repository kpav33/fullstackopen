import React, { useState, useEffect } from "react";
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import NewBlog from "./components/NewBlog";
import { useDispatch, useSelector } from "react-redux";
import { showNotification } from "./reducers/notificationReducer";
import { initializeBlogs, createNewBlog } from "./reducers/blogReducer";

import blogService from "./services/blogs";
import loginService from "./services/login";
import storage from "./utils/storage";

const App = () => {
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs);

  // const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const blogFormRef = React.createRef();

  useEffect(() => {
    dispatch(initializeBlogs());
  }, []);

  useEffect(() => {
    const user = storage.loadUser();
    setUser(user);
  }, []);

  // Create a notification
  const notifyWith = (message, type = "success") => {
    const notification = {
      message,
      type,
    };
    dispatch(showNotification(notification));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username,
        password,
      });

      setUsername("");
      setPassword("");
      setUser(user);
      notifyWith(`${user.name} welcome back!`);
      storage.saveUser(user);
    } catch (exception) {
      notifyWith("wrong username/password", "error");
    }
  };

  const createBlog = async (blog) => {
    try {
      dispatch(createNewBlog(blog));
      blogFormRef.current.toggleVisibility();
      notifyWith(`a new blog '${blog.title}' by ${blog.author} added!`);
    } catch (exception) {
      console.log(exception);
      notifyWith(
        `a new blog '${blog.title}' by ${blog.author} failed to add!`,
        "error"
      );
    }
  };

  const handleLike = async (id) => {
    const blogToLike = blogs.find((b) => b.id === id);
    const likedBlog = {
      ...blogToLike,
      likes: blogToLike.likes + 1,
      user: blogToLike.user.id,
    };
    await blogService.update(likedBlog);
    // setBlogs(
    //   blogs.map((b) =>
    //     b.id === id ? { ...blogToLike, likes: blogToLike.likes + 1 } : b
    //   )
    // );
  };

  const handleRemove = async (id) => {
    const blogToRemove = blogs.find((b) => b.id === id);
    const ok = window.confirm(
      `Remove blog ${blogToRemove.title} by ${blogToRemove.author}`
    );
    if (ok) {
      await blogService.remove(id);
      // setBlogs(blogs.filter((b) => b.id !== id));
    }
  };

  const handleLogout = () => {
    setUser(null);
    storage.logoutUser();
  };

  if (!user) {
    return (
      <div>
        <h2>login to application</h2>

        <Notification />

        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              id="username"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              id="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button id="login">login</button>
        </form>
      </div>
    );
  }

  const byLikes = (b1, b2) => b2.likes - b1.likes;

  return (
    <div>
      <h2>blogs</h2>

      <Notification />

      <p>
        {user.name} logged in <button onClick={handleLogout}>logout</button>
      </p>

      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <NewBlog createBlog={createBlog} />
      </Togglable>

      {blogs.sort(byLikes).map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          handleLike={handleLike}
          handleRemove={handleRemove}
          own={user.username === blog.user.username}
        />
      ))}
    </div>
  );
};

export default App;
