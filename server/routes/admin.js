const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Category = require('../models/Category');

router.get('/users', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) { res.status(500).send('Server error'); }
});

router.delete('/users/:id', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User removed' });
    } catch (err) { res.status(500).send('Server error'); }
});

router.get('/products', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
    try {
        const products = await Product.find().populate('shopkeeperId', 'name');
        res.json(products);
    } catch (err) { res.status(500).send('Server error'); }
});

router.delete('/products/:id', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product removed' });
    } catch (err) { res.status(500).send('Server error'); }
});

router.get('/stats', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
    try {
        const totalSalesArr = await Order.aggregate([
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);
        const totalSales = totalSalesArr[0]?.total || 0;
        const totalOrders = await Order.countDocuments();
        const activeUsers = await User.countDocuments();
        
        // Popular products based on order frequency
        const popularProducts = await Order.aggregate([
            { $unwind: '$products' },
            { $group: { _id: '$products.productId', count: { $sum: '$products.quantity' } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
            { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'productInfo' } },
            { $unwind: '$productInfo' }
        ]);

        res.json({ totalSales, totalOrders, activeUsers, popularProducts });
    } catch (err) { res.status(500).send('Server error'); }
});

router.get('/categories', async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (err) { res.status(500).send('Server error'); }
});

router.post('/categories', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
    const { name, description } = req.body;
    try {
        const category = new Category({ name, description });
        await category.save();
        res.json(category);
    } catch (err) { res.status(500).send('Server error'); }
});

router.put('/categories/:id', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
    const { name, description } = req.body;
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, { name, description }, { new: true });
        res.json(category);
    } catch (err) { res.status(500).send('Server error'); }
});

router.delete('/categories/:id', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.json({ message: 'Category removed' });
    } catch (err) { res.status(500).send('Server error'); }
});

module.exports = router;
