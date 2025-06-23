const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method Not Allowed' })
        };
    }

    try {
        // Parse the request body
        const { name, message } = JSON.parse(event.body);

        // Validate input
        if (!name || !message) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Name and message are required' })
            };
        }

        // Create transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        // Email options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
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

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Love note sent successfully!' })
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to send love note', details: error.message })
        };
    }
};
