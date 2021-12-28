const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
  // Blog.find({}).then((blogs) => response.json(blogs));
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.post("/", (request, response) => {
  const blog = new Blog(request.body);

  blog
    .save()
    .then((result) => response.status(201).json(result))
    .catch((error) => next(error));
});

// // Test if server works
// blogsRouter.get("/test", (request, response) => {
//   response.send("<h1>Hello World!</h1>");
// });

module.exports = blogsRouter;
