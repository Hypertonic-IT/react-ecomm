const otpTemplate = (otp) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Account - Hypertonic</title>
    <style>
        body { margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; color: #1e293b; }
        .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        .header { text-align: center; padding-bottom: 30px; border-bottom: 1px solid #e2e8f0; }
        .logo { font-size: 28px; font-weight: 800; letter-spacing: 2px; color: #000000; text-decoration: none; text-transform: uppercase; }
        .content { padding: 40px 0; text-align: center; }
        .title { font-size: 24px; font-weight: 700; color: #0f172a; margin-bottom: 16px; }
        .description { font-size: 16px; line-height: 24px; color: #64748b; margin-bottom: 32px; }
        .otp-container { background-color: #f1f5f9; border-radius: 12px; padding: 24px; display: inline-block; margin-bottom: 32px; }
        .otp-code { font-size: 42px; font-weight: 800; letter-spacing: 8px; color: #8b5cf6; margin: 0; }
        .footer { text-align: center; padding-top: 30px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; }
        @media screen and (max-width: 600px) { .container { padding: 20px; } .otp-code { font-size: 32px; letter-spacing: 6px; } }
    </style>
</head>
<body>
    <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#f8fafc">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table width="600" border="0" cellspacing="0" cellpadding="0" class="container">
                    <tr><td class="header"><a href="#" class="logo">HYPERTONIC</a></td></tr>
                    <tr>
                        <td class="content">
                            <h1 class="title">Verify Your Email</h1>
                            <p class="description">Thank you for joining Hypertonic. Use the verification code below to complete your registration. This code will expire in 10 minutes.</p>
                            <div class="otp-container"><h2 class="otp-code">${otp}</h2></div>
                            <p style="font-size: 14px; color: #94a3b8;">If you didn't request this code, you can safely ignore this email.</p>
                        </td>
                    </tr>
                    <tr><td class="footer"><p>&copy; 2026 Hypertonic IT. All rights reserved.</p></td></tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;

module.exports = otpTemplate;
