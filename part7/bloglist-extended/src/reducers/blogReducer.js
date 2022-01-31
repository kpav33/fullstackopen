/* eslint-disable no-case-declarations */
import blogService from "../services/blogs";

const blogReducer = (state = [], action) => {
  switch (action.type) {
    case "INIT_BLOGS":
      return action.data;
    case "NEW_BLOG":
      return [...state, action.data];
    case "LIKE":
      const id = action.data.id;
      const blogToChange = state.find((n) => n.id === id);
      const changedBlog = {
        ...blogToChange,
        likes: blogToChange.likes + 1,
      };
      return state.map((blog) => (blog.id !== id ? blog : changedBlog));
    case "COMMENT":
      const idToComment = action.data.id;
      const blogToComment = state.find((n) => n.id === idToComment);
      const commentedBlog = {
        ...blogToComment,
        comments: [...action.data.comments],
      };
      return state.map((blog) =>
        blog.id !== idToComment ? blog : commentedBlog
      );
    case "REMOVE":
      const idToRemove = action.data.id;
      return state.filter((blog) => blog.id !== idToRemove);
    default:
      return state;
  }
};

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll();
    dispatch({
      type: "INIT_BLOGS",
      data: blogs,
    });
  };
};

export const createNewBlog = (content) => {
  return async (dispatch) => {
    const newBlog = await blogService.create(content);
    dispatch({ type: "NEW_BLOG", data: newBlog });
  };
};

export const likeBlog = (blog) => {
  return async (dispatch) => {
    const updatedBlog = await blogService.update(blog);
    dispatch({ type: "LIKE", data: updatedBlog });
  };
};

export const removeBlog = (id) => {
  return async (dispatch) => {
    await blogService.remove(id);
    dispatch({ type: "REMOVE", data: { id } });
  };
};

export const commentBlog = (blog) => {
  return async (dispatch) => {
    const commentedBlog = await blogService.update(blog);
    dispatch({ type: "COMMENT", data: commentedBlog });
  };
};

export default blogReducer;
