const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const helper = require("./test_helper");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

const Blog = require("../models/blog");
const User = require("../models/user");

// Make sure the database is the same every time the tests are ran
beforeEach(async () => {
  // Create a root user
  await User.deleteMany({});

  // Create blogs
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);
});

// beforeEach(async () => {
//   await Blog.deleteMany({});

//   let blogObject = new Blog(helper.initialBlogs[0]);
//   await blogObject.save();

//   blogObject = new Blog(helper.initialBlogs[1]);
//   await blogObject.save();
// });

// More advanced beforeEach function with using Promise.all()
// beforeEach(async () => {
//   await Blog.deleteMany({});

//   const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
//   const promiseArray = blogObjects.map((blog) => blog.save());
//   await Promise.all(promiseArray);
// });

// More advanced beforeEach function that unlike Promise.all() function which executes promises in parallel, ensures that the promises are executed in a specific execution order
// beforeEach(async () => {
//   await Blog.deleteMany({});

//   for (let blog of helper.initialBlogs) {
//     let blogObject = new Blog(blog);
//     await blogObject.save();
//   }
// });

describe("when there are intially some blogs saved", () => {
  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("there is the correct amount of blogs in JSON format", async () => {
    const response = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });

  test("the unique identifier property of the blog posts is named id", async () => {
    const response = await api.get("/api/blogs");

    response.body.forEach((item) => {
      expect(item.id).toBeDefined();
    });
    // expect(response.body[0].id).toBeDefined();
  });

  test("a specific blog is among the returned blogs", async () => {
    const response = await api.get("/api/blogs");

    const contents = response.body.map((item) => item.title);
    expect(contents).toContain("React patterns");
  });
});

describe("addition of a blog", () => {
  let token;

  beforeEach(async () => {
    const newUser = {
      username: "root",
      name: "root",
      password: "password",
    };

    await api.post("/api/users").send(newUser);

    const result = await api.post("/api/login").send(newUser);

    token = result.body.token;
  });

  test("if the token is missing return status code 401 with correct error message", async () => {
    const usersAtStart = await helper.usersInDb();
    const userId = usersAtStart[0].id;

    const newBlog = {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      userId,
    };

    const result = await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(401)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();

    const contents = blogsAtEnd.map((item) => item.title);

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
    expect(contents).not.toContain("Canonical string reduction");
    expect(result.body.error).toContain("token missing");
  });

  test("making HTTP POST request to the /api/blogs url successfully creates a new blog post", async () => {
    const usersAtStart = await helper.usersInDb();
    const userId = usersAtStart[0].id;

    const newBlog = {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      userId,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    // const response = await api.get("/api/blogs");
    const blogsAtEnd = await helper.blogsInDb();

    // const contents = response.body.map((item) => item.title);
    const contents = blogsAtEnd.map((item) => item.title);

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);
    expect(contents).toContain("Canonical string reduction");
  });

  test("verify  if the likes property is missing from the request, it defaults to the value 0", async () => {
    const usersAtStart = await helper.usersInDb();
    const userId = usersAtStart[0].id;

    const newBlog = {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      userId,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    // const response = await api.get("/api/blogs");
    const blogsAtEnd = await helper.blogsInDb();

    // expect(response.body[response.body.length - 1].likes).toBe(0);
    expect(blogsAtEnd[blogsAtEnd.length - 1].likes).toBe(0);
  });

  test("check if the title and url properties are missing from the request data", async () => {
    const missingTitleBlog = {
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    };

    const missingUrlBlog = {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(missingTitleBlog)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(missingUrlBlog)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    // const response = await api.get("/api/blogs");
    const blogsAtEnd = await helper.blogsInDb();

    // expect(response.body).toHaveLength(helper.initialBlogs.length);
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });
});

describe("viewing a specific blog", () => {
  test("succeeds with a valid id", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToView = blogsAtStart[0];

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    // JSON serialization and parsing would be necessary if on of the object keys would be a Date object
    // In that case we would need to first perform a similar JSON serialization and parsing of the blogToView object as the server is performing automatically for the resultBlog.body object
    // const processedBlogToView = JSON.parse(JSON.stringify(blogToView));

    expect(resultBlog.body).toEqual(blogToView);
  });

  test("fails with status code 404 if blog doesn't exist", async () => {
    const validNonExistingId = await helper.nonExistingId();

    await api.get(`/api/blogs/${validNonExistingId}`).expect(404);
  });

  test("fails with status code 400 if blog id is invalid", async () => {
    const invalidId = "421fasfa142";

    await api.get(`/api/blogs/${invalidId}`).expect(400);
  });
});

describe("deletion of a blog", () => {
  let token;

  beforeEach(async () => {
    const newUser = {
      username: "root",
      name: "root",
      password: "password",
    };

    await api.post("/api/users").send(newUser);

    const result = await api.post("/api/login").send(newUser);

    token = result.body.token;
  });

  test("succeeds with status code 204 if id is valid", async () => {
    const newBlog = {
      title: "To delete blog",
      author: "John Smith",
      url: "www.example.com",
      likes: 5,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(201);

    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[blogsAtStart.length - 1];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);

    const contents = blogsAtEnd.map((item) => item.title);
    expect(contents).not.toContain(blogToDelete.title);
  });

  test("fails with status code 400 if blog id is invalid", async () => {
    const invalidId = "421fasfa142";

    await api
      .delete(`/api/blogs/${invalidId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(400);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });
});

describe("updating of a blog", () => {
  test("succeeds with a valid id", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];

    const newBlog = {
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 10,
    };

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(newBlog)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length);
    expect(blogsAtEnd[0].likes).toBe(10);
  });

  test("fails with status code 400 if blog id is invalid", async () => {
    const invalidId = "421fasfa142";

    await api.put(`/api/blogs/${invalidId}`).expect(400);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });
});

describe("when there is initially one user in db", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({ username: "root", passwordHash });

    await user.save();
  });

  test("creation succeeds with a new username", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "mluukkai",
      name: "Matti Luukkainen",
      password: "salainen",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((user) => user.username);
    expect(usernames).toContain(newUser.username);
  });

  test("creation fails with proper status code and message if username already exists in db", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "root",
      name: "root",
      password: "password",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);

    expect(result.body.error).toContain(
      "User validation failed: username: Error, expected `username` to be unique."
    );
  });

  test("creation fails with proper status code and message if username is missing", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      name: "user",
      password: "password",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);

    expect(result.body.error).toContain(
      "User validation failed: username: Path `username` is required."
    );
  });

  test("creation fails with proper status code and message if username is too short", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "us",
      name: "user",
      password: "password",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);

    expect(result.body.error).toContain(
      "is shorter than the minimum allowed length (3)."
    );
  });

  test("creation fails with proper status code and message if password is missing", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "user",
      name: "user",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);

    expect(result.body.error).toContain(
      "Validation failed. Password is required and must be at least 3 characters long or more"
    );
  });

  test("creation fails with proper status code and message if password is too short", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "user",
      name: "user",
      password: "pa",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);

    expect(result.body.error).toContain(
      "Validation failed. Password is required and must be at least 3 characters long or more"
    );
  });
});

afterAll(() => {
  mongoose.connection.close();
});
