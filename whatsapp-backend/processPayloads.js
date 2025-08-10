


// const fs = require('fs');
// const path = require('path');
// const mongoose = require('mongoose');
// require('dotenv').config();

// const Message = require('./models/Message');

// const MONGO_URI = process.env.MONGO_URI;
// const payloadsFolder = path.join(__dirname, 'whatsapp sample payloads');

// async function processPayloads() {
//   try {
//     await mongoose.connect(MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log("✅ MongoDB connected successfully");

//     const files = fs.readdirSync(payloadsFolder);
//     console.log(`Found ${files.length} files in payload folder.`);

//     for (const file of files) {
//       if (!file.endsWith('.json')) continue;

//       const filePath = path.join(payloadsFolder, file);
//       console.log(`Processing file: ${file}`);

//       const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

//       // Navigate inside your payload to get messages array:
//       const messages =
//         data?.metaData?.entry?.[0]?.changes?.[0]?.value?.messages || [];

//       if (messages.length > 0) {
//         console.log(`Found ${messages.length} messages in ${file}`);
//         for (const msg of messages) {
//           console.log(`Upserting message id: ${msg.id}`);

//           await Message.findOneAndUpdate(
//             { id: msg.id },
//             {
//               id: msg.id,
//               meta_msg_id: null,                  // not present in this payload
//               from: msg.from,
//               to: null,                          // you can assign your WhatsApp number or leave null
//               text: msg.text?.body || '',
//               timestamp: new Date(parseInt(msg.timestamp) * 1000),  // convert to ms
//               status: 'sent',                    // default status
//             },
//             { upsert: true }
//           );
//         }
//       } else {
//         console.log(`No messages found in ${file}`);
//       }

//       // No statuses in this payload sample, skip or implement if needed
//     }

//     console.log("✅ All payloads processed successfully");
//     await mongoose.disconnect();
//   } catch (err) {
//     console.error("❌ Error processing payloads:", err);
//     process.exit(1);
//   }
// }

// processPayloads();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const Message = require('./models/Message');

const MONGO_URI = process.env.MONGO_URI;
const payloadsFolder = path.join(__dirname, 'whatsapp sample payloads');

async function processPayloads() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected successfully");

    const files = fs.readdirSync(payloadsFolder);
    console.log(`Found ${files.length} files in payload folder.`);

    for (const file of files) {
      if (!file.endsWith('.json')) continue;

      const filePath = path.join(payloadsFolder, file);
      console.log(`Processing file: ${file}`);

      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

      // Navigate inside your payload to get messages array:
      const messages =
        data?.metaData?.entry?.[0]?.changes?.[0]?.value?.messages || [];

      if (messages.length > 0) {
        console.log(`Found ${messages.length} messages in ${file}`);
        for (const msg of messages) {
          // Convert timestamp to Date
          const ts = parseInt(msg.timestamp);
          const dateObj = isNaN(ts) ? new Date() : new Date(ts * 1000);

          const updatedMsg = await Message.findOneAndUpdate(
            { id: msg.id },
            {
              id: msg.id,
              meta_msg_id: null,
              from: msg.from,
              to: null, // you can add your business number if you want
              text: msg.text?.body || '',
              timestamp: dateObj,
              status: 'sent',
            },
            { upsert: true, new: true }
          );
          console.log(`Upserted message id: ${updatedMsg.id}`);
        }
      } else {
        console.log(`No messages found in ${file}`);
      }
    }

    console.log("✅ All payloads processed successfully");
    await mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error processing payloads:", err);
    process.exit(1);
  }
}

processPayloads();
