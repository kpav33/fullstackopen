import React, { useState } from "react";
const Blog = ({ blog }) => {
  const [showDetails, setShowDetails] = useState(false);

  const handleShowDetails = () => {
    setShowDetails((prevState) => !prevState);
  };

  const blogStyle = {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  console.log(blog);

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
              <strong>Likes</strong> {blog.likes}
            </p>
            <button>Like</button>
          </div>
          <p>
            <strong>Author: </strong>
            {blog.author}
          </p>
        </div>
      )}
    </div>
  );
};

export default Blog;
