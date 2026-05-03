const nodemailer = require('nodemailer');
const sendWelcomeEmail = async (user) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        return;
    }

    const transporter = nodemailer.createTransport({
    service: 'gmail', // This allows Nodemailer to handle the port/host automatically
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false // This prevents the timeout error on Render
    }
});

    let roleAction = "Get Started";
    let roleDescription = "Explore the platform and see what's new today.";

    if (user.role === 'shopkeeper') {
        roleAction = "Set Up Your Store";
        roleDescription = "List your products and start reaching local customers in minutes.";
    } else if (user.role === 'customer') {
        roleAction = "Start Shopping";
        roleDescription = "Discover the best products from your favorite local shops.";
    }

    const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to DukaanSetu</title>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    background-color: #f7f9fc;
                    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                    -webkit-font-smoothing: antialiased;
                }
                .wrapper {
                    width: 100%;
                    table-layout: fixed;
                    background-color: #f7f9fc;
                    padding-bottom: 40px;
                }
                .main {
                    background-color: #ffffff;
                    margin: 20px auto;
                    width: 100%;
                    max-width: 600px;
                    border-spacing: 0;
                    color: #4a4a4a;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.05);
                }
                .header {
                    background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
                    padding: 40px 20px;
                    text-align: center;
                }
                .header h1 {
                    color: #ffffff !important;
                    margin: 0;
                    font-size: 28px;
                    letter-spacing: 1px;
                    font-weight: 700;
                }
                .content {
                    padding: 40px 30px;
                }
                .content h2 {
                    color: #333333;
                    font-size: 22px;
                    margin-bottom: 20px;
                }
                .content p {
                    font-size: 16px;
                    line-height: 1.6;
                    margin-bottom: 25px;
                }
                .feature-box {
                    background-color: #f0f7ff;
                    border-left: 4px solid #007bff;
                    padding: 20px;
                    margin-bottom: 25px;
                    border-radius: 4px;
                }
                .feature-box p {
                    margin: 0;
                    font-weight: 500;
                    color: #0056b3;
                }
                .button-container {
                    text-align: center;
                    margin: 35px 0;
                }
                .button {
                    background-color: #007bff;
                    color: #ffffff !important;
                    padding: 15px 35px;
                    text-decoration: none;
                    border-radius: 50px;
                    font-weight: bold;
                    font-size: 16px;
                    display: inline-block;
                }
                .footer {
                    background-color: #f1f3f5;
                    padding: 30px;
                    text-align: center;
                    font-size: 12px;
                    color: #999999;
                }
                .footer p {
                    margin: 5px 0;
                }
            </style>
        </head>
        <body>
            <center class="wrapper">
                <table class="main">
                    <tr>
                        <td class="header">
                            <h1>DukaanSetu</h1>
                        </td>
                    </tr>
                    <tr>
                        <td class="content">
                            <h2>Hello, ${user.name}!</h2>
                            <p>Welcome to <strong>DukaanSetu</strong> — the bridge between local shops and your neighborhood. We're excited to have you on board!</p>
                            
                            <div class="feature-box">
                                <p>${roleDescription}</p>
                            </div>

                            <p>Your account is now active. You can start exploring all the features we've designed to make your experience seamless and productive.</p>

                            <div class="button-container">
                                <a href="https://dukaansetu-nine.vercel.app/login" class="button">${roleAction}</a>
                            </div>

                            <p>If you have any questions or need assistance, our support team is always here to help. Just reply to this email!</p>
                            
                            <p>Best Regards,<br><strong>The DukaanSetu Team</strong></p>
                        </td>
                    </tr>
                    <tr>
                        <td class="footer">
                            <p>&copy; ${new Date().getFullYear()} DukaanSetu. All rights reserved.</p>
                            <p>Building local communities, one shop at a time.</p>
                        </td>
                    </tr>
                </table>
            </center>
        </body>
        </html>
    `;

    const mailOptions = {
        from: `"DukaanSetu" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: 'Welcome to the DukaanSetu Community! 🛍️',
        html: htmlContent
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("NODEMAILER ERROR:", error);
    }
};

const sendOrderConfirmationEmail = async (user, order) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        return;
    }

    const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

    const productListHtml = order.products.map(p => `
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${p.name || 'Product'}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${p.quantity}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${p.price.toFixed(2)}</td>
        </tr>
    `).join('');

    const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Order Confirmation - DukaanSetu</title>
            <style>
                body { margin: 0; padding: 0; background-color: #f7f9fc; font-family: Arial, sans-serif; }
                .wrapper { width: 100%; table-layout: fixed; background-color: #f7f9fc; padding-bottom: 40px; }
                .main { background-color: #ffffff; margin: 20px auto; width: 100%; max-width: 600px; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
                .header { background: linear-gradient(135deg, #28a745 0%, #218838 100%); padding: 30px; text-align: center; color: white; }
                .header h1 { margin: 0; font-size: 24px; }
                .content { padding: 30px; color: #444; }
                .order-summary { width: 100%; border-collapse: collapse; margin-top: 20px; }
                .total { font-weight: bold; font-size: 18px; color: #333; }
                .footer { background-color: #f1f3f5; padding: 20px; text-align: center; font-size: 12px; color: #999; }
                .button { background-color: #28a745; color: white !important; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; margin-top: 20px; }
            </style>
        </head>
        <body>
            <center class="wrapper">
                <table class="main">
                    <tr>
                        <td class="header">
                            <h1>Order Placed Successfully! 🎉</h1>
                        </td>
                    </tr>
                    <tr>
                        <td class="content">
                            <h2>Hi ${user.name},</h2>
                            <p>Thank you for shopping with <strong>DukaanSetu</strong>. Your order has been placed and is being processed by the shopkeeper.</p>
                            
                            <p><strong>Order ID:</strong> #${order._id.toString().slice(-6).toUpperCase()}</p>
                            
                            <table class="order-summary">
                                <thead>
                                    <tr style="background-color: #f8f9fa;">
                                        <th style="padding: 10px; text-align: left;">Item</th>
                                        <th style="padding: 10px; text-align: center;">Qty</th>
                                        <th style="padding: 10px; text-align: right;">Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${productListHtml}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colspan="2" style="padding: 20px 10px 10px; text-align: right; font-weight: bold;">Total Amount:</td>
                                        <td style="padding: 20px 10px 10px; text-align: right;" class="total">₹${order.totalAmount.toFixed(2)}</td>
                                    </tr>
                                </tfoot>
                            </table>

                            <div style="text-align: center;">
                                <a href="https://dukaansetu-nine.vercel.app/orders" class="button">View My Orders</a>
                            </div>

                            <p style="margin-top: 30px;">We'll notify you when your order status changes. Thank you for supporting local businesses!</p>
                            <p>Best Regards,<br><strong>DukaanSetu Team</strong></p>
                        </td>
                    </tr>
                    <tr>
                        <td class="footer">
                            <p>&copy; ${new Date().getFullYear()} DukaanSetu. All rights reserved.</p>
                        </td>
                    </tr>
                </table>
            </center>
        </body>
        </html>
    `;

    const mailOptions = {
        from: `"DukaanSetu Orders" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: `Order Confirmation - #${order._id.toString().slice(-6).toUpperCase()}`,
        html: htmlContent
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        // Silently fail or log locally
    }
};

module.exports = { sendWelcomeEmail, sendOrderConfirmationEmail };
