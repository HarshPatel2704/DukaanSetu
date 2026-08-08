const nodemailer = require('nodemailer');

/**
 * Sends a premium and professional welcome email to newly registered users.
 * @param {Object} user - The user object containing name, email, and role.
 */
const sendWelcomeEmail = async (user) => {
    // Check if configuration is present
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        return;
    }

    // Gmail configuration for Nodemailer
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // Use SSL
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    // Content based on user role for personalization
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
                                <a href="http://localhost:5173/login" class="button">${roleAction}</a>
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
        // Silently fail or log only critical system errors if absolutely necessary
    }
};

/**
 * Sends a professional order confirmation email to the customer.
 * @param {Object} user - The customer object containing name and email.
 * @param {Object} order - The order object containing products and totalAmount.
 */
const sendOrderConfirmationEmail = async (user, order) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        return;
    }

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        tls: {
            rejectUnauthorized: false
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
                                <a href="http://localhost:5173/orders" class="button">View My Orders</a>
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

/**
 * Sends a low-stock alert email to a shopkeeper.
 * @param {Object} shopkeeper - The shopkeeper user object.
 * @param {Array} items - Array of { product, remainingQty } entries.
 */
const sendLowStockEmail = async (shopkeeper, items) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        return;
    }

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    const rows = items.map(({ product, remainingQty }) => `
        <tr>
            <td style="padding: 12px 10px; border-bottom: 1px solid #f3f4f6;">${product.name}</td>
            <td style="padding: 12px 10px; border-bottom: 1px solid #f3f4f6;">${product.category || 'General'}</td>
            <td style="padding: 12px 10px; border-bottom: 1px solid #f3f4f6; text-align: center;">${remainingQty}</td>
            <td style="padding: 12px 10px; border-bottom: 1px solid #f3f4f6; text-align: center;">${product.lowStockLimit ?? 5}</td>
        </tr>
    `).join('');

    const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Low Stock Alert - DukaanSetu</title>
            <style>
                body { margin: 0; padding: 0; background-color: #f7f9fc; font-family: Arial, sans-serif; }
                .wrapper { width: 100%; table-layout: fixed; background-color: #f7f9fc; padding-bottom: 40px; }
                .main { background-color: #ffffff; margin: 20px auto; width: 100%; max-width: 600px; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
                .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 34px 24px; text-align: center; color: white; }
                .header h1 { margin: 0; font-size: 24px; }
                .content { padding: 32px 30px; color: #444; }
                .highlight { background: #fff7ed; border-left: 4px solid #f59e0b; padding: 18px 20px; border-radius: 6px; margin: 20px 0; }
                .pill { display: inline-block; background: #fff; border: 1px solid #fcd34d; color: #92400e; padding: 6px 12px; border-radius: 999px; font-weight: bold; }
                .button { background-color: #f59e0b; color: white !important; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; margin-top: 22px; }
                .footer { background-color: #f1f3f5; padding: 20px; text-align: center; font-size: 12px; color: #999; }
                .table { width: 100%; border-collapse: collapse; margin-top: 18px; }
                .table th { text-align: left; padding: 10px; background: #fef3c7; color: #92400e; font-size: 13px; }
            </style>
        </head>
        <body>
            <center class="wrapper">
                <table class="main">
                    <tr>
                        <td class="header">
                            <h1>Low Stock Alert</h1>
                        </td>
                    </tr>
                    <tr>
                        <td class="content">
                            <h2>Hello ${shopkeeper.name},</h2>
                            <p>Your inventory needs attention.</p>

                            <div class="highlight">
                                <p style="margin: 0 0 10px;">One or more products have reached the low-stock level:</p>
                                <table class="table">
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Category</th>
                                            <th style="text-align:center;">Remaining</th>
                                            <th style="text-align:center;">Threshold</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${rows}
                                    </tbody>
                                </table>
                            </div>

                            <p>Customers can still purchase the item, but your stock is now close to the restock limit. Please review your inventory and add more units soon to keep the listing active and avoid missed sales.</p>

                            <div style="text-align: center;">
                                <a href="http://localhost:3000/product-management" class="button">Review Inventory</a>
                            </div>

                            <p style="margin-top: 28px;">Best Regards,<br><strong>The DukaanSetu Team</strong></p>
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
        from: `"DukaanSetu Inventory" <${process.env.EMAIL_USER}>`,
        to: shopkeeper.email,
        subject: `Low Stock Alert: ${items.length} item(s) need restocking`,
        html: htmlContent
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        // Silently fail or log only critical errors if needed
    }
};

module.exports = { sendWelcomeEmail, sendOrderConfirmationEmail, sendLowStockEmail };
