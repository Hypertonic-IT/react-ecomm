/**
 * OTP Email Template
 * Generates a beautiful HTML email template for OTP verification
 */

const otpTemplate = (otp) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Account</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 40px 20px;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background: white;
                border-radius: 16px;
                overflow: hidden;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            }
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 40px 30px;
                text-align: center;
                color: white;
            }
            .header h1 {
                font-size: 28px;
                font-weight: 700;
                margin-bottom: 8px;
            }
            .header p {
                font-size: 16px;
                opacity: 0.9;
            }
            .content {
                padding: 40px 30px;
                text-align: center;
            }
            .content h2 {
                font-size: 24px;
                color: #2d3748;
                margin-bottom: 16px;
            }
            .content p {
                font-size: 16px;
                color: #4a5568;
                line-height: 1.6;
                margin-bottom: 30px;
            }
            .otp-box {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                font-size: 36px;
                font-weight: 700;
                letter-spacing: 8px;
                padding: 20px 40px;
                border-radius: 12px;
                display: inline-block;
                margin: 20px 0;
                box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
            }
            .warning {
                background: #fff5f5;
                border-left: 4px solid #fc8181;
                padding: 16px;
                margin: 30px 0;
                border-radius: 8px;
                text-align: left;
            }
            .warning p {
                color: #742a2a;
                font-size: 14px;
                margin: 0;
            }
            .footer {
                background: #f7fafc;
                padding: 30px;
                text-align: center;
                border-top: 1px solid #e2e8f0;
            }
            .footer p {
                font-size: 14px;
                color: #718096;
                margin-bottom: 8px;
            }
            .footer a {
                color: #667eea;
                text-decoration: none;
                font-weight: 600;
            }
            .social-links {
                margin-top: 20px;
            }
            .social-links a {
                display: inline-block;
                margin: 0 8px;
                color: #718096;
                text-decoration: none;
                font-size: 14px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🔐 Hypertonic</h1>
                <p>Premium E-Commerce Experience</p>
            </div>
            
            <div class="content">
                <h2>Verify Your Account</h2>
                <p>
                    Thank you for choosing Hypertonic! To complete your registration or password reset, 
                    please use the One-Time Password (OTP) below:
                </p>
                
                <div class="otp-box">
                    ${otp}
                </div>
                
                <p style="margin-top: 30px;">
                    This code will expire in <strong>10 minutes</strong>. 
                    Please do not share this code with anyone.
                </p>
                
                <div class="warning">
                    <p>
                        <strong>⚠️ Security Notice:</strong><br>
                        If you didn't request this code, please ignore this email. 
                        Your account is safe and no action is required.
                    </p>
                </div>
            </div>
            
            <div class="footer">
                <p>Need help? Contact us at <a href="mailto:support@hypertonic.com">support@hypertonic.com</a></p>
                <p style="margin-top: 16px; font-size: 12px; color: #a0aec0;">
                    © ${new Date().getFullYear()} Hypertonic. All rights reserved.
                </p>
                <div class="social-links">
                    <a href="#">Privacy Policy</a> • 
                    <a href="#">Terms of Service</a> • 
                    <a href="#">Help Center</a>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
};

module.exports = otpTemplate;
