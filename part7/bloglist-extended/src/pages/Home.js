import React from "react";
import Togglable from "../components/Togglable";
import Blog from "../components/Blog";
import NewBlog from "../components/NewBlog";

const Home = ({ blogFormRef, blogs, createBlog, byLikes }) => {
  return (
    <>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <NewBlog createBlog={createBlog} />
      </Togglable>

      {blogs.sort(byLikes).map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </>
  );
};

export default Home;
