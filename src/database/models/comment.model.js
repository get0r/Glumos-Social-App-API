const mongoose = require('mongoose');
const { userSchema } = require('./like.model');

const replySchema = new mongoose.Schema({
  replyBy: userSchema,
  detail: {
    type: String,
    trim: true,
    required: true,
    minlength: 3,
  },
}, { timestamps: true });

const commentSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'posts',
      required: true,
    },

    commentBy: userSchema,

    detail: {
      type: String,
      trim: true,
      required: true,
      minlength: 3,
    },

    replies: [replySchema],

    likeCount: {
      type: Number,
      default: 0,
    },

    likedBy: [mongoose.SchemaTypes.ObjectId],

  },
  {
    timestamps: true,
  },
);

const CommentModel = mongoose.model('Comment', commentSchema);

module.exports = CommentModel;
