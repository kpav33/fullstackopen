const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
  // Blog.find({}).then((blogs) => response.json(blogs));
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  const blog = new Blog(request.body);

  // blog
  //   .save()
  //   .then((result) => response.status(201).json(result))
  //   .catch((error) => next(error));
  try {
    const savedBlog = await blog.save();
    response.status(201).json(savedBlog);
  } catch (exception) {
    next(exception);
  }
});

// // Test if server works
// blogsRouter.get("/test", (request, response) => {
//   response.send("<h1>Hello World!</h1>");
// });

module.exports = blogsRouter;
