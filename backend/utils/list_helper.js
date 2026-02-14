const logger = require("./logger");
const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const sum = (previous, item) => previous + (item.likes || 0);
  return blogs.reduce(sum, 0);
};

const favoriteBlog2 = (blogs) => {
  const fave = { likes: -1, blog: null };
  blogs.forEach((item, index) => {
    if ((item.likes || 0) > fave.likes) {
      fave.likes = item.likes;
      fave.blog = item;
    }
  });
  return fave.blog;
};

const favoriteBlog = (blogs) => {
  const reducer = (favorite, current) => {
    if (favorite === null) {
      return current; // First non-null object becomes initial favorite
    }
    // Treat missing likes as -1 for favorite (so anything beats it)
    // Treat missing likes as 0 for current (so it needs positive likes to win)
    if ((current.likes ?? 0) > (favorite.likes ?? -1)) {
      return current;
    }
    return favorite;
  };
  return blogs.reduce(reducer, null);
};

const mostBlogs = (blogs) => {
  const authorCounts = {};
  blogs.forEach((blog) => {
    authorCounts[blog.author] = (authorCounts[blog.author] || 0) + 1;
  });
  sorted = Object.entries(authorCounts).sort((a, b) => b[1] - a[1]);
  return sorted.length > 0
    ? { author: sorted[0][0], blogs: sorted[0][1] } //the author is [][0], count is [][1]
    : {};
};

const mostLikes = (blogs) => {
  if (!blogs || blogs.length === 0) return { author: null, likes: 0 };
  const authorCounts = {};
  blogs.forEach((blog) => {
    authorCounts[blog.author] = (authorCounts[blog.author] || 0) + blog.likes;
  });
  sorted = Object.entries(authorCounts).sort((a, b) => b[1] - a[1]); //sort on count
  const [author, likes] = sorted[0];
  return { author, likes };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  favoriteBlog2,
  mostBlogs,
  mostLikes,
};
