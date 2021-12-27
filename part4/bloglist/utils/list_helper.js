// to do
const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((a, b) => a + b.likes, 0);
};

const favoriteBlog = (blogs) => {
  if (!blogs.length) {
    return {};
  }

  const mostLikes = blogs.reduce((mostLikesItem, currentItem) => {
    return currentItem.likes > mostLikesItem.likes
      ? currentItem
      : mostLikesItem;
  }, blogs[0]);

  return {
    title: mostLikes.title,
    author: mostLikes.author,
    likes: mostLikes.likes,
  };
};

const mostBlogs = (blogs) => {
  if (!blogs.length) {
    return {};
  }

  // Create a new object that shows how many blogs each author has
  const authorCount = {};
  const authorArray = blogs.map((item) => item.author);
  authorArray.forEach((item) => {
    authorCount[item] = (authorCount[item] || 0) + 1;
  });

  // Find the key in the authorCount object that has the greatest value and return it
  const mostBlogs = Object.keys(authorCount).reduce((a, b) => {
    return authorCount[a] > authorCount[b] ? a : b;
  });

  return {
    author: mostBlogs,
    blogs: authorCount[mostBlogs],
  };
};

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs };
