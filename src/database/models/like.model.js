const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { type: mongoose.SchemaTypes.ObjectId, ref: 'users', required: true },
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

likeSchema.index({ postId: 1 });

const LikeModel = mongoose.model('Like', likeSchema);

module.exports = { LikeModel, userSchema };
