const nodemailer = require('nodemailer');
const otpTemplate = require('../templates/otpTemplate');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com', // More reliable for Outlook/Hotmail
    port: 587,
    secure: false, // Must be false for STARTTLS on port 587
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    tls: {
        rejectUnauthorized: false
    }
});

const sendOTPEmail = async (to, otp) => {
    try {
        const mailOptions = {
            from: process.env.SMTP_USER, // Crucial: Must match the authenticated user
            to: to,
            subject: `Verify Your Account - ${otp}`,
            html: otpTemplate(otp),
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: %s', info.messageId);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};

module.exports = { sendOTPEmail };
