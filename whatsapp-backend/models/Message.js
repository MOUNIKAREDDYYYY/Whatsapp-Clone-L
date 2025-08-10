const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  message_id: { type: String, unique: true },
  meta_msg_id: String,
  from: String,
  to: String,
  text: String,
  timestamp: Date,
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read', 'pending'],
    default: 'pending',
  },
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);


