const jwt = require("jsonwebtoken");
const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const userExtractor = require("../utils/middleware").userExtractor;

// Extracted to middleware
// const getTokenFrom = (request) => {
//   const authorization = request.get("authorization");
//   if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
//     return authorization.substring(7);
//   }
//   return null;
// };

blogsRouter.get("/", async (request, response) => {
  // Blog.find({}).then((blogs) => response.json(blogs));
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
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

blogsRouter.post("/", userExtractor, async (request, response, next) => {
  const body = request.body;
  try {
    // Check for valid token
    // const token = getTokenFrom(request);
    const decodedToken = jwt.verify(request.token, process.env.SECRET);
    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: "token missing or invalid" });
    }

    // Replaced with userExtractor middleware
    // const user = await User.findById(decodedToken.id);
    const user = request.user;

    if (body.title === undefined || body.url === undefined) {
      return response.status(400).json({ error: "bad request" });
    }

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: user._id,
    });

    // blog
    //   .save()
    //   .then((result) => response.status(201).json(result))
    //   .catch((error) => next(error));

    // Could use https://github.com/davidbanham/express-async-errors to remove try/catch blocks

    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
    response.status(201).json(savedBlog);
  } catch (exception) {
    next(exception);
  }
});

blogsRouter.delete("/:id", userExtractor, async (request, response, next) => {
  try {
    // Check for valid token
    const decodedToken = jwt.verify(request.token, process.env.SECRET);
    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: "token missing or invalid" });
    }
    const userId = request.user.id || "";

    // Only allow user to delete a blog if they created it
    const blog = await Blog.findById(request.params.id);
    if (blog.user.toString() !== userId.toString()) {
      return response.status(401).json({ error: "wrong user" });
    }

    await Blog.findByIdAndRemove(request.params.id);
    response.status(204).end();
  } catch (exception) {
    next(exception);
  }
});

blogsRouter.put("/:id", async (request, response, next) => {
  try {
    const body = request.body;

    const blog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
    };

    const newBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
      new: true,
    });
    response.json(newBlog);
  } catch (exception) {
    next(exception);
  }
});

// // Test if server works
// blogsRouter.get("/test", (request, response) => {
//   response.send("<h1>Hello World!</h1>");
// });

module.exports = blogsRouter;
