const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const logger = require("../utils/logger");

blogsRouter.get("/", async (request, response, next) => {
  logger.info("handling /api/blogs");
  try {
    const blogs = await Blog.find({});
    response.json(blogs);
  } catch (error) {
    next(error);
  }
});

blogsRouter.get("/:id", async (request, response, next) => {
  const id = request.params.id;
  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return response.status(404).end();
    }
    response.json(blog);
  } catch (error) {
    logger.error(error);
    next(error);
  }
});

blogsRouter.delete("/:id", async (request, response, next) => {
  const id = request.params.id;
  try {
    const result = await Blog.findByIdAndDelete(request.params.id);
    response.status(204).end();
  } catch (error) {
    next(error);
  }
});

blogsRouter.put("/:id", async (request, response, next) => {
  const { title, author, url, likes } = request.body;

  try {
    const blog = await Blog.findById(request.params.id);
    if (!blog) {
      return response.status(404).end();
    }

    blog.title = title;
    blog.author = author;
    blog.url = url;
    blog.likes = likes;

    const updatedBlog = await blog.save();
    response.json(updatedBlog);
  } catch (error) {
    next(error);
  }
});

blogsRouter.post("/", async (request, response, next) => {
  logger.info("adding a note");
  const body = request.body;

  //reject if missing data
  if (!body.title || !body.url) {
    return response.status(400).json({ error: "title or url missing" });
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
  });

  try {
    const savedBlog = await blog.save();
    response.status(201).json(savedBlog);
  } catch (error) {
    next(error);
  }
});

module.exports = blogsRouter;
