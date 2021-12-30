const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.get("/", async (request, respones) => {
  const users = await User.find({}).populate("blogs", {
    url: 1,
    title: 1,
    author: 1,
  });
  respones.json(users);
});

usersRouter.post("/", async (request, response, next) => {
  const body = request.body;

  // Check if password is defined and long enough
  if (body.password === undefined || body.password.length < 3) {
    return response.status(400).json({
      error:
        "Validation failed. Password is required and must be at least 3 characters long or more",
    });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(body.password, saltRounds);

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  });

  try {
    const savedUser = await user.save();
    response.json(savedUser);
  } catch (exception) {
    next(exception);
  }
});

module.exports = usersRouter;
