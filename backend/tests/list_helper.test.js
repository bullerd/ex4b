const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");

const testBlogs = [
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
    likes: 5,
    __v: 0,
  },
  {
    _id: "5a422aa71b54a676234d17f3",
    title: "Test # 2",
    author: "David Buller",
    url: "https://bullerfamily.net/menu.html",
    likes: 3,
    __v: 0,
  },

  {
    _id: "5a422aa71b54a676234d17f1",
    title: "Coding is good for the soul",
    author: "David M. Buller",
    url: "https://codingisfun.com",
    likes: 12,
    __v: 0,
  },

  {
    _id: "5a422aa71b54a676234d17fb",
    title: "More likes",
    author: "David M. Buller",
    url: "https://codingisfun.com",
    likes: 7,
    __v: 0,
  },
];

const blogsForAuthorTests = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0,
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0,
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0,
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0,
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0,
  },
];

const missingLikes = {
  _id: "5a422aa71b54a676234d17a3",
  title: "Missing likes altogether",
  author: "David E. Buller",
  url: "https://badcodingisfun.com",
  sortalikes: 3,
  __v: 0,
};

test("dummy returns one", () => {
  assert.strictEqual(listHelper.dummy([]), 1);
});

describe("total likes", () => {
  test("when list has only one blog, equals the likes of that", () => {
    const result = listHelper.totalLikes([testBlogs[0]]);
    assert.strictEqual(result, 5);
  });

  test("when list is empty, equals 0", () => {
    const result = listHelper.totalLikes([]);
    assert.strictEqual(result, 0);
  });

  test("when list has multiple blogs, equals the sum of the likes", () => {
    const result = listHelper.totalLikes(testBlogs);
    assert.strictEqual(result, 27);
  });

  test("when list has multiple blogs, missing 'likes' field, uses 0 for likes", () => {
    const result = listHelper.totalLikes(testBlogs.concat(missingLikes));
    assert.strictEqual(result, 27);
  });
});

describe("favorite blog", () => {
  test("when there is 1 clear winner", () => {
    assert.deepStrictEqual(listHelper.favoriteBlog(testBlogs), testBlogs[2]);
  });

  test("when there are no blogs", () => {
    assert.strictEqual(listHelper.favoriteBlog([]), null);
  });

  test("when there are is 1 blog and it is missing likes", () => {
    assert.deepStrictEqual(
      listHelper.favoriteBlog([missingLikes]),
      missingLikes,
    );
  });

  test("when there is 1 blog and it contains likes", () => {
    assert.deepStrictEqual(
      listHelper.favoriteBlog([testBlogs[0]]),
      testBlogs[0],
    );
  });
});

describe("most blogs", () => {
  test("when there is a winner", () => {
    assert.deepStrictEqual(listHelper.mostBlogs(blogsForAuthorTests), {
      author: "Robert C. Martin",
      blogs: 3,
    });
  });

  test("when there is only 1 blog", () => {
    assert.deepStrictEqual(listHelper.mostBlogs([testBlogs[2]]), {
      author: "David M. Buller",
      blogs: 1,
    });
  });

  test("when there are no blogs", () => {
    assert.deepStrictEqual(listHelper.mostBlogs([]), {});
  });
});

describe("most likes by author", () => {
  test("when there are multiple blogs", () => {
    const result = listHelper.mostLikes(blogsForAuthorTests);
    assert.deepStrictEqual(result, { author: "Edsger W. Dijkstra", likes: 17 });
  });

  test("with no blogs", () => {
    const result = listHelper.mostLikes([]);
    assert.deepStrictEqual(result, { author: null, likes: 0 });
  });

  test("with one blog", () => {
    const result = listHelper.mostLikes([testBlogs[2]]);
    assert.deepStrictEqual(result, { author: "David M. Buller", likes: 12 });
  });
});
