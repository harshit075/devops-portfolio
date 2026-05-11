const express = require('express');
const cors = require('cors');
const os = require('os');
const { Pool } = require('pg');
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

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect()
  .then(() => console.log('Connected to PostgreSQL database'))
  .catch(err => console.error('Database connection error:', err));

// DB Test Endpoint
app.get('/api/db-status', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ status: 'connected', time: result.rows[0].now });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

// --- ADMIN DASHBOARD APIs ---

// Todos
app.get('/api/admin/todos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM todos ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post('/api/admin/todos', async (req, res) => {
  try {
    const { text, priority } = req.body;
    const result = await pool.query('INSERT INTO todos (text, priority) VALUES ($1, $2) RETURNING *', [text, priority || 'normal']);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.put('/api/admin/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('UPDATE todos SET done = NOT done WHERE id = $1 RETURNING *', [id]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.delete('/api/admin/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM todos WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Diary
app.get('/api/admin/diary', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM diary_entries ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post('/api/admin/diary', async (req, res) => {
  try {
    const { date, content } = req.body;
    const result = await pool.query('INSERT INTO diary_entries (date, content) VALUES ($1, $2) RETURNING *', [date, content]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Goals
app.get('/api/admin/goals', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM goals ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post('/api/admin/goals', async (req, res) => {
  try {
    const { text } = req.body;
    const result = await pool.query('INSERT INTO goals (text) VALUES ($1) RETURNING *', [text]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.put('/api/admin/goals/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { progress } = req.body;
    const result = await pool.query('UPDATE goals SET progress = $1 WHERE id = $2 RETURNING *', [progress, id]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.delete('/api/admin/goals/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM goals WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Notes
app.get('/api/admin/notes', async (req, res) => {
  try {
    const result = await pool.query("SELECT value FROM settings WHERE key = 'important_note'");
    res.json({ note: result.rows.length ? result.rows[0].value : '' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post('/api/admin/notes', async (req, res) => {
  try {
    const { content } = req.body;
    await pool.query("INSERT INTO settings (key, value) VALUES ('important_note', $1) ON CONFLICT (key) DO UPDATE SET value = $1", [content]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Stats
app.get('/api/admin/stats', async (req, res) => {
  try {
    const todosTotal = await pool.query('SELECT COUNT(*) FROM todos');
    const todosDone = await pool.query('SELECT COUNT(*) FROM todos WHERE done = true');
    const diaryCount = await pool.query('SELECT COUNT(*) FROM diary_entries');
    const goalsData = await pool.query('SELECT AVG(progress) as avg_progress, COUNT(*) as total FROM goals');
    res.json({
      todos: { total: parseInt(todosTotal.rows[0].count), done: parseInt(todosDone.rows[0].count) },
      diary: { total: parseInt(diaryCount.rows[0].count) },
      goals: { total: parseInt(goalsData.rows[0].total), avgProgress: Math.round(parseFloat(goalsData.rows[0].avg_progress) || 0) }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete diary entry
app.delete('/api/admin/diary/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM diary_entries WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update todo priority
app.patch('/api/admin/todos/:id/priority', async (req, res) => {
  try {
    const { id } = req.params;
    const { priority } = req.body;
    const result = await pool.query('UPDATE todos SET priority = $1 WHERE id = $2 RETURNING *', [priority, id]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
