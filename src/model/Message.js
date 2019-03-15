const mongoose = require('mongoose');

const { Schema } = mongoose;

const messageSchema = new Schema({
  reservationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ad', required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hirerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, minlength: 1, required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: {
    createdAt: 'created_at'
  }
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
