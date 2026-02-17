const assert = require("node:assert");
const { test, after, beforeEach, describe } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const helper = require("./test_helper");
const Blog = require("../models/blog");
const blog = require("../models/blog");

const api = supertest(app);

describe("blog testing", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(helper.initialBlogs);
  });

  describe("getting blogs", () => {
    test("blogs are returned as json", async () => {
      await api
        .get("/api/blogs")
        .expect(200)
        .expect("Content-Type", /application\/json/);
    });

    test("all blogs are returned", async () => {
      const response = await api.get("/api/blogs");
      assert.strictEqual(response.body.length, helper.initialBlogs.length);
    });

    test("a specific blog is within the returned notes", async () => {
      const response = await api.get("/api/blogs");

      const contents = response.body.map((e) => e.title);
      assert(contents.includes("Coding is good for the soul"));
    });
  });

  describe("conversion of _id to id property", () => {
    test("blog posts have id property instead of _id", async () => {
      const result = await helper.blogsInDb(); // or whatever returns the blog post
      result.forEach((post) => {
        assert.ok(post.id, "each post should have id property");
        assert.strictEqual(
          post._id,
          undefined,
          "posts should not have _id property",
        );
      });
    });
  });

  describe("addition of a new blog", () => {
    test("succeeds with valid data", async () => {
      const newBlog = {
        title: "Insertion of a new blog during testing",
        author: "David M. Buller",
        url: "bullerempowerment.com/testing123",
        likes: 2,
      };

      await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);

      const blog = blogsAtEnd.find((blog) => blog.title === newBlog.title);
      const { id, ...blogWithoutId } = blog;
      assert(blog);
      assert.deepStrictEqual(blogWithoutId, newBlog);
    });

    test("succeeds and defaults likes to 0 if likes is missing", async () => {
      const newBlog = {
        title: "Second Insertion of a new blog during testing",
        author: "David M. Buller",
        url: "bullerempowerment.com/testing123",
      };

      await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);
      const blog = blogsAtEnd.find((blog) => blog.title === newBlog.title);
      assert(blog);

      assert.strictEqual(blog.likes, 0);
    });

    test("fails with status code 400 if no title property", async () => {
      const newBlog = {
        author: "David M. Buller",
        url: "bullerempowerment.com/testing123",
        likes: 5,
      };

      await api.post("/api/blogs").send(newBlog).expect(400);
    });

    test("fails with status code 400 if title property is empty", async () => {
      const newBlog = {
        title: "",
        author: "David M. Buller",
        url: "bullerempowerment.com/testing123",
        likes: 5,
      };

      await api.post("/api/blogs").send(newBlog).expect(400);
    });

    test("fails with status code 400 if no URL property", async () => {
      const newBlog = {
        title: "Testing no URL...",
        author: "David M. Buller",
        likes: 5,
      };

      await api.post("/api/blogs").send(newBlog).expect(400);
    });

    test("fails with status code 400 if URL property is empty", async () => {
      const newBlog = {
        title: "Test URL is empty string",
        author: "David M. Buller",
        url: "",
        likes: 5,
      };

      await api.post("/api/blogs").send(newBlog).expect(400);
    });
  });

  describe("deletion of a blog", () => {
    test("succeeds with status code 204 if id is valid", async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToDelete = blogsAtStart[0];

      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

      const blogsAtEnd = await helper.blogsInDb();

      const ids = blogsAtEnd.map((b) => b.id);
      assert(!ids.includes(blogToDelete.id));

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1);
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
