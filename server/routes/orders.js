const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { sendOrderConfirmationEmail, sendLowStockEmail } = require('../utils/emailSender');

// Place order (Customer)
router.post('/', auth, async (req, res) => {
    const { products } = req.body;
    try {
        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        const productIds = products.map(p => p.productId);
        const dbProducts = await Product.find({ _id: { $in: productIds } });
        const productMap = new Map(dbProducts.map(product => [product._id.toString(), product]));

        for (const item of products) {
            const product = productMap.get(item.productId?.toString());
            if (!product) {
                return res.status(404).json({ message: 'One product in your cart is no longer available' });
            }
            if (item.quantity < 1) {
                return res.status(400).json({ message: `Invalid quantity for ${product.name}` });
            }
            if (product.stockQuantity < item.quantity) {
                return res.status(400).json({
                    message: `Only ${product.stockQuantity} unit(s) available for ${product.name}`
                });
            }
        }

        const orderProducts = products.map(item => {
            const product = productMap.get(item.productId?.toString());
            return {
                productId: item.productId,
                quantity: Number(item.quantity),
                price: product.price
            };
        });
        const orderTotal = orderProducts.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const lowStockByShopkeeper = new Map();

        orderProducts.forEach(item => {
            const product = productMap.get(item.productId?.toString());
            const remainingQty = product.stockQuantity - item.quantity;
            const lowStockLimit = product.lowStockLimit ?? 5;

            if (remainingQty <= lowStockLimit) {
                const key = product.shopkeeperId.toString();
                if (!lowStockByShopkeeper.has(key)) {
                    lowStockByShopkeeper.set(key, []);
                }
                lowStockByShopkeeper.get(key).push({
                    product: {
                        name: product.name,
                        category: product.category,
                        lowStockLimit
                    },
                    remainingQty
                });
            }
        });

        const newOrder = new Order({
            customerId: req.user.id,
            products: orderProducts,
            totalAmount: orderTotal
        });
        const order = await newOrder.save();

        await Promise.all(orderProducts.map(item =>
            Product.findByIdAndUpdate(item.productId, {
                $inc: { stockQuantity: -item.quantity }
            })
        ));

        const io = req.app.get('socketio');

        // Send order confirmation email in background
        try {
            const user = await User.findById(req.user.id);
            // Populate product names for the email and identify unique shopkeepers
            const shopkeeperIds = new Set();
            const populatedProducts = await Promise.all(orderProducts.map(async (p) => {
                const product = await Product.findById(p.productId);
                if (product) shopkeeperIds.add(product.shopkeeperId.toString());
                return {
                    ...p,
                    name: product ? product.name : 'Product'
                };
            }));

            // Notify each unique shopkeeper via socket
            shopkeeperIds.forEach(skId => {
                io.to(skId).emit('newOrder', {
                    message: 'You have a new order!',
                    orderId: order._id
                });
            });

            const emailData = {
                _id: order._id,
                totalAmount: order.totalAmount,
                products: populatedProducts
            };

            sendOrderConfirmationEmail(user, emailData).catch(e => {});

            await Promise.all(
                [...lowStockByShopkeeper.entries()].map(async ([shopkeeperId, items]) => {
                    const shopkeeper = await User.findById(shopkeeperId);
                    if (shopkeeper) {
                        await sendLowStockEmail(shopkeeper, items);
                    }
                })
            );
        } catch (emailErr) {
            // Silently fail if email or socket fails
        }

        res.json(order);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Get order history (Customer)
router.get('/customer', auth, async (req, res) => {
    try {
        const orders = await Order.find({ customerId: req.user.id })
            .populate('products.productId')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Update order status (Shopkeeper)
router.put('/:id/status', auth, async (req, res) => {
    console.log(`Status update request for order ${req.params.id} to ${req.body.status}`);
    if (req.user.role !== 'shopkeeper') return res.status(403).json({ message: 'Access denied' });
    const { status } = req.body;
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (err) {
        console.error("Order status update error:", err);
        res.status(500).send('Server error');
    }
});

// Get sales for shopkeeper (Sales and Profit) - Updated for new model
router.get('/shopkeeper', auth, async (req, res) => {
    if (req.user.role !== 'shopkeeper') return res.status(403).json({ message: 'Access denied' });

    try {
        // Find all orders that contain products belonging to this shopkeeper
        const orders = await Order.find()
            .populate({
                path: 'products.productId',
                match: { shopkeeperId: req.user.id }
            })
            .populate('customerId', 'name address');
        
        // Filter orders to only include relevant products
        const mySales = orders.map(order => {
            const myProducts = order.products.filter(p => p.productId !== null);
            if (myProducts.length === 0) return null;
            
            const myTotal = myProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0);
            return {
                _id: order._id,
                customerId: order.customerId,
                products: myProducts,
                totalAmount: myTotal,
                status: order.status,
                createdAt: order.createdAt
            };
        }).filter(o => o !== null);

        const profit = mySales.reduce((sum, order) => sum + order.totalAmount, 0);
        res.json({ orders: mySales, profit });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router;
