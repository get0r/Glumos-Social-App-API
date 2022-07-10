const PostModel = require('../database/models/post.model');

/**
 * It creates a new post and saves it to the database
 * @param creatorId - The user id of the user who created the post.
 * @param postDetail - This is an object that contains the details of the post.
 * @returns The saved post
 */
const createNewPost = async (creatorId, postDetail) => {
  const post = new PostModel({
    ...postDetail,
    postedBy: creatorId,
  });

  const savedPost = await post.save();

  return savedPost;
};

module.exports = {
  createNewPost,
};
