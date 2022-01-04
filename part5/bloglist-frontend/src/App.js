import React, { useState, useEffect } from "react";
import blogService from "./services/blogs";
import loginService from "./services/login";
import { LoginForm } from "./components/LoginForm";
import { BlogsList } from "./components/BlogsList";
import { Notification } from "./components/Notification";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [notification, setNotification] = useState(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [user, setUser] = useState(null);

  // console.log(user);

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

  return (
    <div>
      {user === null ? (
        <LoginForm
          handleLogin={handleLogin}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
        />
      ) : (
        <BlogsList
          user={user}
          setUser={setUser}
          blogs={blogs}
          setBlogs={setBlogs}
          addNotification={addNotification}
        />
      )}
      <br />
      <Notification notification={notification} />
    </div>
  );
};

export default App;
