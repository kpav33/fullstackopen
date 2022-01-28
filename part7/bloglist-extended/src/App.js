import React, { useEffect } from "react";
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useRouteMatch,
} from "react-router-dom";
// import Blog from "./components/Blog";
import Notification from "./components/Notification";
// import Togglable from "./components/Togglable";
// import NewBlog from "./components/NewBlog";
import Home from "./pages/Home";
import Users from "./pages/Users";
import User from "./pages/User";
import { useDispatch, useSelector } from "react-redux";
import { showNotification } from "./reducers/notificationReducer";
import {
  initializeBlogs,
  createNewBlog,
  likeBlog,
  removeBlog,
} from "./reducers/blogReducer";
import { initializeUser, login, logout } from "./reducers/loginReducer";
import { initializeUsers } from "./reducers/userReducer";

const App = () => {
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs);
  const user = useSelector((state) => state.user);
  const users = useSelector((state) => state.users);
  // console.log(users);

  const blogFormRef = React.createRef();

  const match = useRouteMatch("/users/:id");
  const userMatch = match
    ? users.find((item) => item.id === match.params.id)
    : null;

  const history = useHistory();

  useEffect(() => {
    dispatch(initializeBlogs());
    dispatch(initializeUser());
    dispatch(initializeUsers());
  }, []);

  // Create a notification
  const notifyWith = (message, type = "success") => {
    const notification = {
      message,
      type,
    };
    dispatch(showNotification(notification));
  };

  const handleLogin = (event) => {
    event.preventDefault();

    const username = event.target.username.value;
    const password = event.target.password.value;

    event.target.username.value = "";
    event.target.password.value = "";

    dispatch(login({ username, password }));
  };

  const createBlog = (blog) => {
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

  const handleLike = (id) => {
    const blogToLike = blogs.find((b) => b.id === id);
    const likedBlog = {
      ...blogToLike,
      likes: blogToLike.likes + 1,
      user: blogToLike.user.id,
    };
    dispatch(likeBlog(likedBlog));
  };

  const handleRemove = (id) => {
    const blogToRemove = blogs.find((b) => b.id === id);
    const ok = window.confirm(
      `Remove blog ${blogToRemove.title} by ${blogToRemove.author}`
    );
    if (ok) {
      dispatch(removeBlog(id));
    }
  };

  const handleLogout = () => {
    // setUser(null);
    // storage.logoutUser();
    dispatch(logout());
    history.push("/");
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
              type="text"
              name="username"
              // value={username}
              // onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              id="password"
              type="text"
              name="password"
              // value={password}
              // onChange={({ target }) => setPassword(target.value)}
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

      <Switch>
        <Route exact path="/">
          <Home
            user={user}
            blogFormRef={blogFormRef}
            createBlog={createBlog}
            blogs={blogs}
            handleLike={handleLike}
            handleRemove={handleRemove}
            handleLogout={handleLogout}
            byLikes={byLikes}
          />
        </Route>
        <Route path="/users/:id">
          <User user={userMatch} />
        </Route>
        <Route path="/users">
          <Users />
        </Route>
        <Redirect from="*" to="/" />
      </Switch>

      {/* <Togglable buttonLabel="create new blog" ref={blogFormRef}>
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
      ))} */}
    </div>
  );
};

export default App;
