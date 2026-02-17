const Blog = require("../models/blog");

const initialBlogs = [
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
    likes: 5,
  },
  {
    title: "Test # 2",
    author: "David Buller",
    url: "https://bullerfamily.net/menu.html",
    likes: 3,
  },
  {
    title: "Coding is good for the soul",
    author: "David M. Buller",
    url: "https://codingisfun.com",
    likes: 12,
  },
  {
    title: "More likes",
    author: "David M. Buller",
    url: "https://codingisfun.com",
    likes: 7,
  },
];

const nonExistingId = async () => {
  const blog = new Blog({ title: "willremovethissoon" });
  await blog.save();
  await blog.deleteOne();

  return blog._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
};
