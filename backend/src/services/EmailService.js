const nodemailer = require('nodemailer');
const otpTemplate = require('../templates/otpTemplate');
require('dotenv').config();

let testAccount = null;

const getTransporter = async () => {
    // Check if we have valid real credentials
    const hasRealCreds = process.env.SMTP_USER && !process.env.SMTP_USER.includes('your-email');

    if (hasRealCreds) {
        return nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp-mail.outlook.com',
            port: process.env.SMTP_PORT || 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
            tls: {
                rejectUnauthorized: false
            }
        });
    }

    // Fallback to Ethereal (Test Account)
    if (!testAccount) {
        testAccount = await nodemailer.createTestAccount();
    }

    return nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });
};

const sendOTPEmail = async (to, otp) => {
    try {
        const transporter = await getTransporter();
        const hasRealCreds = process.env.SMTP_USER && !process.env.SMTP_USER.includes('your-email');
        const sender = hasRealCreds ? (process.env.SMTP_FROM || process.env.SMTP_USER) : '"Hypertonic Support" <support@hypertonic.com>';

        const mailOptions = {
            from: sender,
            to: to,
            subject: `Verify Your Account - ${otp}`,
            html: otpTemplate(otp),
        };

        const info = await transporter.sendMail(mailOptions);

        console.log('--------------------------------------------------');
        console.log(`Email Sent ID: ${info.messageId}`);
        if (!hasRealCreds) {
            console.log(' [TEST MODE] View your email here:');
            console.log(` 🔗 PREVIEW URL: ${nodemailer.getTestMessageUrl(info)}`);
            console.log(` 🔑 OTP Code: ${otp}`);
        }
        console.log('--------------------------------------------------');

        return true;
    } catch (error) {
        console.error('Error sending email:', error.message);

        // Final fallback log
        console.log('========== FALLBACK OTP LOG ==========');
        console.log(` 🔑 OTP Code: ${otp}`);
        console.log('======================================');

        return true;
    }
};

module.exports = { sendOTPEmail };
