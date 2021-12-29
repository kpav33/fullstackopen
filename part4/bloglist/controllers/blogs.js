const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
  // Blog.find({}).then((blogs) => response.json(blogs));
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.get("/:id", async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id);
    if (blog) {
      response.json(blog);
    } else {
      response.status(404).end();
    }
  } catch (exception) {
    next(exception);
  }
});

blogsRouter.post("/", async (request, response, next) => {
  const body = request.body;

  if (body.title === undefined || body.url === undefined) {
    return response.status(400).json({ error: "bad request" });
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
  });

  // blog
  //   .save()
  //   .then((result) => response.status(201).json(result))
  //   .catch((error) => next(error));

  // Could use https://github.com/davidbanham/express-async-errors to remove try/catch blocks

  try {
    const savedBlog = await blog.save();
    response.status(201).json(savedBlog);
  } catch (exception) {
    next(exception);
  }
});

blogsRouter.delete("/:id", async (request, response, next) => {
  try {
    await Blog.findByIdAndRemove(request.params.id);
    response.status(204).end();
  } catch (exception) {
    next(exception);
  }
});

// // Test if server works
// blogsRouter.get("/test", (request, response) => {
//   response.send("<h1>Hello World!</h1>");
// });

module.exports = blogsRouter;
