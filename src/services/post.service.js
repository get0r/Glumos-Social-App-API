const { default: mongoose } = require('mongoose');
const { LikeModel } = require('../database/models/like.model');
const PostModel = require('../database/models/post.model');
const UserModel = require('../database/models/user.model');
const RootService = require('./root.service');
const AWSService = require('./third-party/aws.s3.service');

/**
 * It creates a new post and saves it to the database
 * @param creatorId - The user id of the user who created the post.
 * @param postDetail - This is an object that contains the details of the post.
 * @returns The saved post
 */
const createNewPost = async (creatorId, postDetail, postImages) => {
  let imgInfo = {};
  if (postImages) imgInfo = await AWSService.uploadImagesToS3(postImages, creatorId, false);

  const post = new PostModel({
    ...postDetail,
    imgsLink: imgInfo.imgsLink,
    imgsKey: imgInfo.imgsKey,
    postedBy: creatorId,
  });
  const savedPost = await post.save();

  return savedPost;
};

/**
 * It fetches a post from the database,
 * and also fetches the user who posted it, and the likes on the
 * post
 * @param postId - The id of the post we want to get.
 */
const getPost = async (postId) => {
  const posts = await PostModel.aggregate([
    {
      $match: { _id: mongoose.Types.ObjectId(postId) },
    }, {
      $lookup: {
        from: 'users',
        let: { postedBy: '$postedBy' },
        pipeline: [
          {
            $match: { $expr: { $eq: ['$_id', '$$postedBy'] } },
          },
          {
            $project: { fullName: 1, title: 1, ppLink: 1 },
          },
        ],
        as: 'postedBy',
      },
    },
    {
      $lookup: {
        from: 'likes',
        let: { originalPostId: '$_id' },
        pipeline: [
          { $match: { $expr: { $eq: ['$postId', '$$originalPostId'] } } },
          { $project: { _id: 0, likedBy: 1, createdAt: 1 } },
        ],
        as: 'likes',
      },
    },
    {
      $unwind: '$postedBy',
    },
  ]);
  if (!posts.length) return null;
  return posts[0];
};

/**
 * It takes a postId and a likedById, checks if the post exists, checks if the user has already
 * liked
 * the post, if not, it creates a new like, increments the likeCount of the post by 1,
 * and returns the
 * post. If the user has already liked the post, it deletes the like,
 * decrements the likeCount of the
 * post by 1, and returns the post
 * @param likedById - The user id of the user who liked the post.
 * @param postId - The id of the post that is being liked/unliked
 * @returns The post object
 */
const likeUnlikePost = async (likedById, postId) => {
  const post = await RootService.getDataById(PostModel, postId);
  if (!post) return null;

  const like = await RootService.getDataByFilter(LikeModel, { postId, 'likedBy.userId': likedById });

  if (!like) {
    const user = await RootService.getDataById(UserModel, likedById);

    const newLike = new LikeModel({
      postId,
      likedBy: {
        userId: likedById,
        fullName: user.fullName,
        ppLink: user.ppLink,
      },
    });

    await newLike.save();
    await RootService.updateDataByIdByOperator(PostModel, postId, { $inc: { likeCount: 1 } });
    return getPost(postId);
  }

  await RootService.deleteDataByFilter(LikeModel, { postId, 'likedBy.userId': likedById });
  await RootService.updateDataByIdByOperator(PostModel, postId, { $inc: { likeCount: -1 } });

  return getPost(postId);
};

const getPosts = async (page = 1, query = {}, sort = {}) => {
  const PAGE_SIZE = 12;
  const SKIP = page ? (+page - 1) * PAGE_SIZE : 0;

  return PostModel.aggregate([
    { $match: query.postedBy ? { postedBy: mongoose.Types.ObjectId(query.postedBy) } : {} },
    {
      $lookup: {
        from: 'users',
        let: { postedBy: '$postedBy' },
        pipeline: [
          {
            $match: { $expr: { $eq: ['$_id', '$$postedBy'] } },
          },
          {
            $project: { fullName: 1, title: 1, ppLink: 1 },
          },
        ],
        as: 'postedBy',
      },
    },
    {
      $lookup: {
        from: 'likes',
        let: { originalPostId: '$_id' },
        pipeline: [
          { $match: { $expr: { $eq: ['$postId', '$$originalPostId'] } } },
          { $project: { _id: 0, likedBy: 1, createdAt: 1 } },
        ],
        as: 'likes',
      },
    },
    { $unwind: '$postedBy' },
    { $sort: Object.keys(sort).length ? sort : { likeCount: -1, commentCount: 1, createdAt: 1 } },
    { $skip: SKIP },
    { $limit: PAGE_SIZE },
  ]);
};

module.exports = {
  createNewPost,
  getPost,
  getPosts,
  likeUnlikePost,
};
