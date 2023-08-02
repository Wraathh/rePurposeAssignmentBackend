const Post = require('../../models/post');
const User = require('../../models/users');

const { PubSub } = require("graphql-subscriptions") // Import PubSub from the correct package
const pubSub=new PubSub(); // Create a new instance of the PubSub class

const POST_ADDED="POST_ADDED"

const { transformPost } = require('./merge');

module.exports = {
  posts: async () => {
    try {
      const posts = await Post.find();
      return posts.map(post => {
        return transformPost(post);
      });
    } catch (err) {
      throw err;
    }
  },
  createPost: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    const post = new Post({
      title: args.postInput.title,
      description: args.postInput.description,
      content: args.postInput.content,
      createdAt: new Date(args.postInput.createdAt),
      creator: req.userId
    });
    let createdPost;
    try {
      const result = await post.save();
      createdPost = transformPost(result);
      const creator = await User.findById(req.userId);

      if (!creator) {
        throw new Error('User not found.');
      }
      creator.createdPosts.push(post);
      await creator.save();
        // Publish the newly created post to subscribers
        pubSub.publish(POST_ADDED, { newPost: createdPost });
      return createdPost;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  Subscription:{
    newPost:{
      subscribe:()=> pubSub.asyncIterator(POST_ADDED)
      
    }
  }
};