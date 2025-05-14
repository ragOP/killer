const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Message = require('./models/Message');

dotenv.config();

const app = express();
app.use(express.json()); 
const cors = require('cors');
app.use(cors());  // This allows all domains, adjust if needed for security
app.use(express.static('public'));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB error:', err));

app.post('/api/sms', async (req, res) => {
  try {
    const { sender, body } = req.body;
    if (!sender || !body) {
      return res.status(400).json({ error: 'Missing sender or body' });
    }

    const message = new Message({ sender, body });
    await message.save();

    res.status(201).json({ success: true, message: 'SMS saved' });
  } catch (err) {
    console.error('💥 Error saving SMS:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


app.get('/api/sms', async (req, res) => {
    try {
      const messages = await Message.find().sort({ createdAt: -1 });
      res.status(200).json(messages);
    } catch (err) {
      console.error('💥 Error fetching SMS:', err);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
