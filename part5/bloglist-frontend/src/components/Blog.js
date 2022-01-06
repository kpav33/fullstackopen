import React, { useState } from "react";
import PropTypes from "prop-types";

const Blog = ({ blog, user, updateBlog, deleteBlog }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [blogObject, setBlogObject] = useState(blog);

  const handleShowDetails = () => {
    setShowDetails((prevState) => !prevState);
  };

  const handleLikeClick = async () => {
    const updatedBlog = {
      ...blogObject,
      likes: blogObject.likes + 1,
    };
    setBlogObject(updatedBlog);

    // Call the updated blog function with the passed updatedBlog object
    updateBlog(updatedBlog);
  };

  const handleRemove = async () => {
    deleteBlog(blog);
  };

  const blogStyle = {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}{" "}
        <button onClick={handleShowDetails}>
          {showDetails ? "hide" : "view"}
        </button>
      </div>
      {showDetails && (
        <div>
          <p>
            <strong>URL: </strong>
            {blog.url}
          </p>
          <div>
            <p>
              <strong>Likes</strong> {blogObject.likes}
            </p>
            <button onClick={handleLikeClick}>Like</button>
          </div>
          <p>
            <strong>Author: </strong>
            {blog.author}
          </p>
          {/* Check typeof blog.user === "string" to make sure the remove button appears for items immediately after creating them, without this you would need to do a manual page refresh, before the remove button would become accessible on the newly added blog, even if it was created by the currently logged in user */}
          {/* When item is first added the blog.user key returns the id of the user not the user object, object is added when data is fetched from the database by using the populate option */}
          {/* This is why this little hack here is used, because the only time blog.user would be of type "string" is when there is a new blog created */}
          {(user.username === blog.user.username ||
            typeof blog.user === "string") && (
            <button onClick={handleRemove}>remove</button>
          )}
        </div>
      )}
    </div>
  );
};

export default Blog;

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  updateBlog: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
};
