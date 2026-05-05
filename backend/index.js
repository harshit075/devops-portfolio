const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Basic health check
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Contact form API
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Here you would typically integrate with an email service like SendGrid, Resend, or Nodemailer
  console.log('Received contact message:', { name, email, message });
  
  res.status(200).json({ success: true, message: 'Message received successfully' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
