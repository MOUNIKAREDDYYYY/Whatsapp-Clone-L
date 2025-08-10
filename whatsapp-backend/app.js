// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');

// const app = express();
// const PORT = process.env.PORT || 8081;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Debug log to verify .env loaded correctly
// console.log('Mongo URI:', process.env.MONGO_URI);

// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log('✅ MongoDB connected'))
// .catch(err => console.error('❌ MongoDB connection error:', err));

// // Import routes
// const messagesRouter = require('./routes/messages');
// app.use('/api/messages', messagesRouter);

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });



require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8081;

app.use(cors());
app.use(express.json());

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Import your messages routes
const messagesRouter = require('./routes/messages');
app.use('/api/messages', messagesRouter);  // <== Mount the router here

app.get('/', (req, res) => res.send('Backend is running'));

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

