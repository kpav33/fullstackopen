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

module.exports = { dummy, totalLikes, favoriteBlog };
