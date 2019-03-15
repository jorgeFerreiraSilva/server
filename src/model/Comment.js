const mongoose = require('mongoose');

const { Schema } = mongoose;

const commentSchema = new Schema({
  adId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ad', required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, minlength: 6, maxlength: 280, required: true },
}, {
  timestamps: {
    createdAt: 'created_at'
  }
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
