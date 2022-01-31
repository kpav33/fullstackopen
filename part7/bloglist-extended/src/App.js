import React, { useEffect } from "react";
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useRouteMatch,
} from "react-router-dom";
import Notification from "./components/Notification";
import Menu from "./components/Menu";
import Home from "./pages/Home";
import Users from "./pages/Users";
import User from "./pages/User";
import BlogSubpage from "./pages/BlogSubpage";
import { useDispatch, useSelector } from "react-redux";
import { showNotification } from "./reducers/notificationReducer";
import {
  initializeBlogs,
  createNewBlog,
  likeBlog,
  removeBlog,
  commentBlog,
} from "./reducers/blogReducer";
import { initializeUser, login, logout } from "./reducers/loginReducer";
import { initializeUsers } from "./reducers/userReducer";

import Container from "react-bootstrap/Container";

const App = () => {
  // Get data from redux store
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs);
  const user = useSelector((state) => state.user);
  const users = useSelector((state) => state.users);

  const blogFormRef = React.createRef();

  // Check for route match
  const userMatch = useRouteMatch("/users/:id");
  const userFound = userMatch
    ? users.find((item) => item.id === userMatch.params.id)
    : null;

  const blogMatch = useRouteMatch("/blogs/:id");
  const blogFound = blogMatch
    ? blogs.find((item) => item.id === blogMatch.params.id)
    : null;

  const history = useHistory();

  // Initialize state values
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

  // Handle login
  const handleLogin = (event) => {
    event.preventDefault();

    const username = event.target.username.value;
    const password = event.target.password.value;

    event.target.username.value = "";
    event.target.password.value = "";

    dispatch(login({ username, password }));
  };

  // Create a blog
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

  // Handle liking a blog
  const handleLike = (id) => {
    const blogToLike = blogs.find((b) => b.id === id);
    const likedBlog = {
      ...blogToLike,
      likes: blogToLike.likes + 1,
      user: blogToLike.user.id,
    };
    dispatch(likeBlog(likedBlog));
  };

  // Add a comment to a blog
  const handleComment = (event, id) => {
    event.preventDefault();
    const comment = event.target.comment.value;
    event.target.comment.value = "";

    const blogToComment = blogs.find((b) => b.id === id);
    const commentedBlog = {
      ...blogToComment,
      comments: [...blogToComment.comments, comment],
    };

    dispatch(commentBlog(commentedBlog));
  };

  // Remove a blog
  const handleRemove = (id) => {
    const blogToRemove = blogs.find((b) => b.id === id);
    const ok = window.confirm(
      `Remove blog ${blogToRemove.title} by ${blogToRemove.author}`
    );
    if (ok) {
      dispatch(removeBlog(id));
      history.push("/");
    }
  };

  // Handle user logout
  const handleLogout = () => {
    dispatch(logout());
    history.push("/");
  };

  // Display login screen if user information is not found in local storage
  if (!user) {
    return (
      <div>
        <h2>login to application</h2>

        <Notification />

        <form onSubmit={handleLogin}>
          <div>
            username
            <input id="username" type="text" name="username" />
          </div>
          <div>
            password
            <input id="password" type="text" name="password" />
          </div>
          <button id="login">login</button>
        </form>
      </div>
    );
  }

  // Sort by likes function
  const byLikes = (b1, b2) => b2.likes - b1.likes;

  return (
    <Container>
      <div>
        <Menu />
        <p style={{ display: "inline-block", marginBottom: "0px" }}>
          {user.name} logged in <button onClick={handleLogout}>logout</button>
        </p>
      </div>

      <h2>blogs</h2>

      <Notification />
      <br />

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
          <User user={userFound} />
        </Route>
        <Route path="/users">
          <Users />
        </Route>
        <Route path="/blogs/:id">
          <BlogSubpage
            blog={blogFound}
            handleLike={handleLike}
            handleRemove={handleRemove}
            handleComment={handleComment}
            username={user.username}
          />
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
    </Container>
  );
};

export default App;
