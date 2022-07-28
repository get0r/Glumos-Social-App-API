const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    detail: {
      type: String,
      trim: true,
      required: true,
      minlength: 3,
    },

    imgsLink: [String],
    imgsKey: [String],

    likeCount: {
      type: Number,
      default: 0,
    },

    postedBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },

    commentCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const PostModel = mongoose.model('Post', postSchema);

module.exports = PostModel;
