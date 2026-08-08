const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');

// Post review (Customer) - Updated for Order level review
router.post('/', auth, async (req, res) => {
    const { orderId, rating, comment } = req.body;
    try {
        const order = await Order.findById(orderId).populate('products.productId');
        if (!order) return res.status(404).json({ message: 'Order not found' });
        if (order.customerId.toString() !== req.user.id) return res.status(401).json({ message: 'Unauthorized' });

        // Extract unique shopkeeper IDs from all products in this order
        const shopkeeperIds = [...new Set(order.products.map(p => p.productId?.shopkeeperId?.toString()))].filter(id => id);

        const newReview = new Review({
            orderId: order._id,
            customerId: req.user.id,
            shopkeeperIds,
            rating,
            comment
        });
        const review = await newReview.save();
        res.json(review);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Get reviews for shopkeeper
router.get('/shopkeeper', auth, async (req, res) => {
    if (req.user.role !== 'shopkeeper') return res.status(403).json({ message: 'Access denied' });

    try {
        const reviews = await Review.find({ shopkeeperIds: req.user.id })
            .populate('customerId', 'name')
            .populate({
                path: 'orderId',
                populate: {
                    path: 'products.productId',
                    select: 'name'
                }
            })
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Get reviews for a product (Public)
router.get('/product/:id', async (req, res) => {
    try {
        const reviews = await Review.find({ productId: req.params.id })
            .populate('customerId', 'name');
        res.json(reviews);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;
