const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Product = require('../models/Product');

// Get all products (Customer/Public) with searching and filtering
router.get('/', async (req, res) => {
    const { search, category, minPrice, maxPrice } = req.query;
    let query = {};

    if (search) {
        query.name = { $regex: search, $options: 'i' };
    }
    if (category) {
        query.category = category;
    }
    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    try {
        const products = await Product.find(query).populate('shopkeeperId', 'name address');
        res.json(products);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Get products by shopkeeper (Specific route first)
router.get('/shopkeeper', auth, async (req, res) => {
    if (req.user.role !== 'shopkeeper') return res.status(403).json({ message: 'Access denied' });

    try {
        const products = await Product.find({ shopkeeperId: req.user.id });
        res.json(products);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Get single product (Dynamic ID route last)
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        console.error("Error finding product by ID:", err);
        res.status(500).json({ message: 'Server error: Invalid product ID format' });
    }
});

// Create product (Shopkeeper only)
router.post('/', auth, async (req, res) => {
    if (req.user.role !== 'customer' && req.user.role !== 'shopkeeper') return res.status(403).json({ message: 'Only shopkeepers can add products' });

    const { name, price, description, image, category } = req.body;
    try {
        const newProduct = new Product({
            name, price, description, image, category, shopkeeperId: req.user.id
        });
        const product = await newProduct.save();
        res.json(product);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Update product (Shopkeeper only)
router.put('/:id', auth, async (req, res) => {
    if (req.user.role !== 'shopkeeper') return res.status(403).json({ message: 'Access denied' });

    const { name, price, description, image, category } = req.body;
    try {
        let product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        if (product.shopkeeperId.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

        product = await Product.findByIdAndUpdate(req.params.id, { name, price, description, image, category }, { new: true });
        res.json(product);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Delete product (Shopkeeper only)
router.delete('/:id', auth, async (req, res) => {
    if (req.user.role !== 'shopkeeper') return res.status(403).json({ message: 'Access denied' });

    try {
        let product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        if (product.shopkeeperId.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;
