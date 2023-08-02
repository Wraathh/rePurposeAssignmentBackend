const DataLoader = require('dataloader');

const Post = require('../../models/post');
const User = require('../../models/users');
const { dateToString } = require('../../helpers/date');

const postLoader = new DataLoader(postIds => {
  return posts(postIds);
});

const userLoader = new DataLoader(userIds => {
  return User.find({ _id: { $in: userIds } });
});

const posts = async postIds => {
  try {
    const posts = await Post.find({ _id: { $in: postIds } });
    posts.sort((a, b) => {
      return (
        postIds.indexOf(a._id.toString()) - postIds.indexOf(b._id.toString())
      );
    });
    return posts.map(post => {
      return transformPost(post);
    });
  } catch (err) {
    throw err;
  }
};

// const singleEvent = async eventId => {
//   try {
//     const event = await eventLoader.load(eventId.toString());
//     return event;
//   } catch (err) {
//     throw err;
//   }
// };

const user = async userId => {
  try {
    const user = await userLoader.load(userId.toString());
    return {
      ...user._doc,
      _id: user.id,
      createdPosts: () => postLoader.loadMany(user._doc.createdPosts)
    };
  } catch (err) {
    throw err;
  }
};

const transformPost = post => {
  return {
    ...post._doc,
    _id: post.id,
    date: dateToString(post._doc.createdAt),
    creator: user.bind(this, post.creator)
  };
};



exports.transformPost = transformPost;

// exports.user = user;
// exports.events = events;
// exports.singleEvent = singleEvent;