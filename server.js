const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Serve static files from the root directory
app.use(express.static(path.join(__dirname), {
    setHeaders: (res, path) => {
        if (path.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        }
    }
}));

// Handle favicon.ico
app.get('/favicon.ico', (req, res) => {
    res.status(204).end();
});

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Route to serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle form submission
app.post('/submit', async (req, res) => {
    try {
        const { name, message } = req.body;
        
        // Validate required fields
        if (!name || !message) {
            return res.status(400).json({ error: 'Name and message are required' });
        }
        
        // Email options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Sending to yourself
            subject: `New Love Note from ${name}`,
            text: `Name: ${name}\n\nMessage: ${message}`,
            html: `
                <h2>New Love Note Received! 💌</h2>
                <p><strong>From:</strong> ${name}</p>
                <p><strong>Message:</strong></p>
                <p>${(message || '').toString().replace(/\n/g, '<br>')}</p>
            `
        };

        // Send email
        await transporter.sendMail(mailOptions);
        
        // Redirect to thank you page
        res.redirect('/thank-you.html');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Error sending message');
    }
});

// Serve thank you page
app.get('/thank-you.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'thank-you.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
