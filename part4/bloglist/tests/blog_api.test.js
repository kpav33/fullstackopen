const mongoose = require("mongoose");
const helper = require("./test_helper");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

const Blog = require("../models/blog");

// Make sure the database is the same every time the tests are ran
beforeEach(async () => {
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

describe("test blog operations", () => {
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

describe("viewing a specific blog", () => {
  test("succeeds with a valid id", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToView = blogsAtStart[0];

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const processedBlogToView = JSON.parse(JSON.stringify(blogToView));

    expect(resultBlog.body).toEqual(processedBlogToView);
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

describe("deletion of a note", () => {
  test("succeeds with status code 204 if id is valid", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);

    const contents = blogsAtEnd.map((item) => item.title);
    expect(contents).not.toContain(blogToDelete.title);
  });

  test("fails with status code 400 if blog id is invalid", async () => {
    const invalidId = "421fasfa142";

    await api.delete(`/api/blogs/${invalidId}`).expect(400);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });
});

describe("updating of a note", () => {
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

afterAll(() => {
  mongoose.connection.close();
});
