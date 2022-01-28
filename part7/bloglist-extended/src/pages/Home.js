import React from "react";
import Togglable from "../components/Togglable";
import Blog from "../components/Blog";
import NewBlog from "../components/NewBlog";

const Home = ({
  user,
  blogFormRef,
  blogs,
  createBlog,
  handleLike,
  handleRemove,
  byLikes,
}) => {
  return (
    <>
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
    </>
  );
};

export default Home;
