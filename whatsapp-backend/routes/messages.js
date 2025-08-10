// const express = require('express');
// const router = express.Router();
// const Message = require('../models/Message');

// // GET all messages sorted by timestamp ascending
// router.get('/', async (req, res) => {
//   try {
//     const messages = await Message.find().sort({ timestamp: 1 });
//     res.json(messages);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // POST a new message
// router.post('/', async (req, res) => {
//   try {
//     const { id, meta_msg_id, from, to, text, timestamp, status } = req.body;

//     // Validate required fields (you can expand validation)
//     if (!id || !from || !to) {
//       return res.status(400).json({ error: 'Missing required fields: id, from, to' });
//     }

//     const msg = new Message({
//       id,
//       meta_msg_id: meta_msg_id || null,
//       from,
//       to,
//       text: text || '',
//       timestamp: timestamp ? new Date(timestamp) : new Date(),
//       status: status || 'sent',
//     });

//     await msg.save();
//     res.status(201).json(msg);
//   } catch (err) {
//     // Duplicate key error means message with this id exists, so upsert might be better
//     if (err.code === 11000) {
//       res.status(409).json({ error: 'Message with this id already exists' });
//     } else {
//       res.status(400).json({ error: err.message });
//     }
//   }
// });

// // PATCH update message status by id or meta_msg_id
// router.patch('/:msgId/status', async (req, res) => {
//   try {
//     const { msgId } = req.params;
//     const { status } = req.body;

//     // Validate status
//     if (!['sent', 'delivered', 'read'].includes(status)) {
//       return res.status(400).json({ error: 'Invalid status value' });
//     }

//     const msg = await Message.findOneAndUpdate(
//       { $or: [{ id: msgId }, { meta_msg_id: msgId }] },
//       { status },
//       { new: true }
//     );

//     if (!msg) return res.status(404).json({ error: 'Message not found' });
//     res.json(msg);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// GET all messages sorted by timestamp
router.get('/', async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new message
router.post('/', async (req, res) => {
  try {
    const { id, meta_msg_id, from, to, text, timestamp, status } = req.body;
    const msg = new Message({
      message_id: id || meta_msg_id,   // Ensure this matches your schema field
      from,
      to,
      text,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
      status: status || 'sent',
    });
    await msg.save();
    res.status(201).json(msg);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH update message status by id or meta_msg_id
router.patch('/:msgId/status', async (req, res) => {
  try {
    const { msgId } = req.params;
    const { status } = req.body;
    const msg = await Message.findOneAndUpdate(
      { $or: [{ message_id: msgId }, { meta_msg_id: msgId }] },
      { status },
      { new: true }
    );
    if (!msg) return res.status(404).json({ error: 'Message not found' });
    res.json(msg);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
