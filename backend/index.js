const express = require('express');
const cors = require('cors');
const os = require('os');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// CPU Usage Helper
function getCpuTime() {
  const cpus = os.cpus();
  let idle = 0;
  let total = 0;
  for (const cpu of cpus) {
    for (const type in cpu.times) {
      total += cpu.times[type];
    }
    idle += cpu.times.idle;
  }
  return { idle, total };
}

let previousCpuTime = getCpuTime();

function getCpuUsage(previous) {
  const current = getCpuTime();
  const idleDifference = current.idle - previous.idle;
  const totalDifference = current.total - previous.total;
  if (totalDifference === 0) return { percentage: 0, current };
  const percentage = 100 - ~~(100 * idleDifference / totalDifference);
  return { percentage, current };
}

// Telemetry SSE
let clients = [];

app.get('/api/telemetry', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders(); // Establish SSE

  clients.push(res);
  console.log('Client connected to telemetry. Active:', clients.length);

  req.on('close', () => {
    clients = clients.filter(client => client !== res);
    console.log('Client disconnected. Active:', clients.length);
  });
});

setInterval(() => {
  if (clients.length === 0) return; // Don't broadcast if no clients

  const cpuData = getCpuUsage(previousCpuTime);
  previousCpuTime = cpuData.current;
  
  const memoryTotal = os.totalmem() / (1024 * 1024 * 1024);
  const memoryFree = os.freemem() / (1024 * 1024 * 1024);
  const memoryUsed = memoryTotal - memoryFree;

  const data = JSON.stringify({
    cpu: Math.max(0, Math.min(100, cpuData.percentage)),
    memoryUsed,
    memoryTotal,
    activeUsers: clients.length,
    hostUptime: os.uptime(),
    platform: `${os.platform()} ${os.arch()}`,
    cpuCores: os.cpus().length,
    heapUsed: process.memoryUsage().heapUsed / (1024 * 1024),
    heapTotal: process.memoryUsage().heapTotal / (1024 * 1024)
  });

  clients.forEach(client => client.write(`data: ${data}\n\n`));
}, 1500);

// Basic health check
app.get('/', (req, res) => {
  res.send('Server is running');
});

const nodemailer = require('nodemailer');
const multer = require('multer');

// Configure multer for memory storage (we'll attach the buffer directly to the email)
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Contact form API
app.post('/api/contact', upload.single('attachment'), async (req, res) => {
  const { name, email, subject, message } = req.body;
  
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'harshitborana75@gmail.com',
        pass: process.env.EMAIL_PASS // App Password
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER || 'harshitborana75@gmail.com',
      to: 'harshitborana75@gmail.com',
      subject: subject ? `Portfolio Contact: ${subject}` : `New Portfolio Contact from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject || 'N/A'}\n\nMessage:\n${message}`,
      replyTo: email
    };

    // If there's an uploaded file, attach it
    if (req.file) {
      mailOptions.attachments = [
        {
          filename: req.file.originalname,
          content: req.file.buffer
        }
      ];
    }

    await transporter.sendMail(mailOptions);
    console.log('Successfully sent contact email from:', name);
    res.status(200).json({ success: true, message: 'Message received successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
