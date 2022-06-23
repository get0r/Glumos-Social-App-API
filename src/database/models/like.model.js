const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { type: mongoose.SchemaTypes.ObjectId, required: true },
  fullName: String,
  ppLink: String,
});

const likeSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'posts',
      required: true,
    },

    likedBy: userSchema,
  },
  {
    timestamps: true,
  },
);

const LikeModel = mongoose.model('Like', likeSchema);

module.exports = LikeModel;
