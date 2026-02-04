const otpTemplate = (otp) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Identity</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&family=Inter:wght@400;500&display=swap');
        
        body {
            margin: 0;
            padding: 0;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #f3f4f6;
            -webkit-font-smoothing: antialiased;
        }

        .wrapper {
            width: 100%;
            table-layout: fixed;
            background-color: #f3f4f6;
            padding: 40px 0;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .header {
            background: linear-gradient(135deg, #000000 0%, #1e293b 100%);
            padding: 40px 20px;
            text-align: center;
        }

        .logo {
            font-family: 'Outfit', sans-serif;
            font-size: 32px;
            font-weight: 800;
            color: #ffffff;
            letter-spacing: 4px;
            text-transform: uppercase;
            text-decoration: none;
        }

        .content {
            padding: 48px 40px;
            text-align: center;
        }

        .title {
            font-family: 'Outfit', sans-serif;
            font-size: 28px;
            font-weight: 700;
            color: #111827;
            margin: 0 0 16px 0;
        }

        .message {
            font-size: 16px;
            line-height: 26px;
            color: #6b7280;
            margin-bottom: 32px;
        }

        .otp-box {
            background-color: #f9fafb;
            border: 2px dashed #e5e7eb;
            border-radius: 16px;
            padding: 32px;
            margin-bottom: 32px;
        }

        .otp-code {
            font-family: 'Outfit', sans-serif;
            font-size: 48px;
            font-weight: 800;
            letter-spacing: 12px;
            color: #000000;
            margin: 0;
            line-height: 1;
        }

        .timer-info {
            display: inline-flex;
            align-items: center;
            background-color: #fee2e2;
            color: #ef4444;
            padding: 8px 16px;
            border-radius: 9999px;
            font-size: 13px;
            font-weight: 600;
            margin-bottom: 24px;
        }

        .footer {
            padding: 32px 20px;
            background-color: #f9fafb;
            text-align: center;
            border-top: 1px solid #f3f4f6;
        }

        .footer-text {
            font-size: 13px;
            color: #9ca3af;
            margin-bottom: 8px;
        }

        .social-links {
            margin-top: 16px;
        }

        .social-links a {
            color: #9ca3af;
            text-decoration: none;
            margin: 0 10px;
            font-size: 12px;
        }
        
        .ignore-msg {
            font-size: 13px;
            color: #9ca3af;
            margin-top: 24px;
        }

        /* Mobile Adjustments */
        @media only screen and (max-width: 600px) {
            .container {
                border-radius: 0;
            }
            .content {
                padding: 40px 24px;
            }
            .otp-code {
                font-size: 36px;
                letter-spacing: 8px;
            }
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="container">
            <div class="header">
                <a href="#" class="logo">HYPERTONIC</a>
            </div>
            
            <div class="content">
                <h1 class="title">Security Verification</h1>
                <p class="message">
                    To proceed with your request, please use the following one-time verification code. For your security, please do not share this code with anyone.
                </p>
                
                <div class="otp-box">
                    <h2 class="otp-code">${otp}</h2>
                </div>
                
                <div class="timer-info">
                    VALID FOR 5 MINUTES ONLY
                </div>
                
                <p class="ignore-msg">
                    If you didn't request this code, you can safely ignore this email. Someone may have entered your email by mistake.
                </p>
            </div>
            
            <div class="footer">
                <p class="footer-text">© 2026 Hypertonic Solutions. All rights reserved.</p>
                <div class="social-links">
                    <a href="#">Privacy Policy</a>
                    <a href="#">Support Center</a>
                    <a href="#">Terms of Service</a>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
`;

module.exports = otpTemplate;

