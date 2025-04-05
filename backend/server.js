const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const { parse } = require('csv-parse');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Message Schema
const messageSchema = new mongoose.Schema({
    phone_number: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, default: 'Pending' },
    datetime: { type: Date, default: Date.now },
}, { timestamps: true });

messageSchema.index({ phone_number: 1, message: 1 }, { unique: true });
const Message = mongoose.model('Message', messageSchema);

// Multer setup for file upload
const upload = multer({ dest: 'uploads/' });

// API to upload CSV
app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const results = [];
    fs.createReadStream(req.file.path)
        .pipe(parse({ columns: true, trim: true }))
        .on('data', (row) => {
            results.push({
                phone_number: row.phone_number,
                message: row.message,
                status: 'Pending',
            });
        })
        .on('end', async () => {
            try {
                await Message.insertMany(results, { ordered: false }); // Skip duplicates
                fs.unlinkSync(req.file.path); // Delete temp file
                res.status(200).json({ message: 'Data uploaded successfully' });
            } catch (err) {
                console.error(err);
                res.status(500).json({ error: 'Failed to upload data' });
            }
        })
        .on('error', (err) => res.status(500).json({ error: err.message }));
});

// API to get all messages
app.get('/api/messages', async (req, res) => {
    try {
        const messages = await Message.find();
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// API to get pending messages (for mobile clients)
app.get('/api/pending', async (req, res) => {
    try {
        const pending = await Message.find({ status: 'Pending' });
        res.status(200).json(pending);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// API to update message status (used by mobile clients)
app.put('/api/update/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const message = await Message.findByIdAndUpdate(
            req.params.id,
            { status, datetime: new Date() },
            { new: true }
        );
        if (!message) return res.status(404).json({ error: 'Message not found' });
        res.status(200).json(message);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => console.log(`Server running on port ${port}`));