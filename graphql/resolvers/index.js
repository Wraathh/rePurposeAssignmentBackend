const authResolver = require('./auth');
const postsResolver = require('./posts');

const rootResolver = {
  ...authResolver,
  ...postsResolver,
};

module.exports = rootResolver;