const mongoose = require("mongoose");
const helper = require("./test_helper");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

const Blog = require("../models/blog");

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
beforeEach(async () => {
  await Blog.deleteMany({});

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog);
    await blogObject.save();
  }
});

describe("Test blog operations", () => {
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

    expect(response.body).toHaveLength(2);
  });

  test("the unique identifier property of the blog posts is named id", async () => {
    const response = await api.get("/api/blogs");

    response.body.forEach((item) => {
      expect(item.id).toBeDefined();
    });
    // expect(response.body[0].id).toBeDefined();
  });

  test("making HTTP POST request to the /api/blogs url successfully creates a new blog post", async () => {
    const newBlog = {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
    };

    await api
      .post("/api/blogs")
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

  test("verify  if the likes property is missing from the request, it  defaults to the value 0", async () => {
    const newBlog = {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    };

    await api
      .post("/api/blogs")
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
      .send(missingTitleBlog)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    await api
      .post("/api/blogs")
      .send(missingUrlBlog)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    // const response = await api.get("/api/blogs");
    const blogsAtEnd = await helper.blogsInDb();

    // expect(response.body).toHaveLength(helper.initialBlogs.length);
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
