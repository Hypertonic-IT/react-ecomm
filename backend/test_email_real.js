const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    tls: {
        rejectUnauthorized: false
    }
});

async function test() {
    console.log("Attempting to send email with:");
    console.log("User:", process.env.SMTP_USER);
    console.log("Pass:", process.env.SMTP_PASS);

    try {
        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to: process.env.SMTP_USER, // Send to self
            subject: "Test Email from Debug Script",
            text: "If you receive this, the credentials work!"
        });
        console.log("Success! Message ID:", info.messageId);
    } catch (error) {
        console.error("FAILED to send email.");
        console.error("Error Code:", error.code);
        console.error("Error Message:", error.message);
        console.error("Response:", error.response);
    }
}

test();
