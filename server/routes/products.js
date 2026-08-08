const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Product = require('../models/Product');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// AI Description Generator
router.post('/generate-description', auth, async (req, res) => {
    if (req.user.role !== 'shopkeeper') return res.status(403).json({ message: 'Access denied' });

    const { name, category, price } = req.body;
    if (!name) return res.status(400).json({ message: 'Product name is required' });

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
        return res.status(500).json({ message: 'Gemini API Key is missing or invalid in server .env' });
    }

    try {
        const apiKey = (process.env.GEMINI_API_KEY || "").trim();
        if (!apiKey) throw new Error("API Key is missing in .env");

        const genAI = new GoogleGenerativeAI(apiKey);
        const modelNames = [
            process.env.GEMINI_MODEL,
            "gemini-3.5-flash",
            "gemini-flash-latest",
            "gemini-2.5-flash"
        ].filter(Boolean);

        const buildPrompt = (retry = false) => `Product name: ${name}
Category: ${category || 'General'}
${price ? `Price: ₹${price}` : ""}
Write an accurate product description for this marketplace listing in 2 short sentences.
Requirements:
- 25 to 45 words total.
- Mention the product name or product type.
- Use only details that can be reasonably inferred from the product name, category, and price.
- Do not claim freshness, premium quality, organic, handmade, discounts, warranty, brand, size, weight, flavor, color, or material unless clearly present in the product name.
- Focus on practical use, simple customer value, and suitability for local shopping.
- Sound natural for an online local shop listing.
- Return only the description text, no title, bullets, or quotes.
${retry ? "- The previous answer was too short. Make this one more descriptive and complete." : ""}`;
        
        let text = "";
        let lastError;

        for (const modelName of modelNames) {
            try {
                console.log(`AI Request: Generating for ${name} using ${modelName}...`);
                const model = genAI.getGenerativeModel({
                    model: modelName,
                    generationConfig: {
                        temperature: 0.35,
                        maxOutputTokens: 120
                    }
                });
                const result = await model.generateContent(buildPrompt(false));
                text = result.response.text();
                if (text && text.trim().split(/\s+/).length < 18) {
                    const retryResult = await model.generateContent(buildPrompt(true));
                    text = retryResult.response.text();
                }
                if (text) break;
            } catch (modelErr) {
                lastError = modelErr;
                console.error(`AI Error with ${modelName}:`, modelErr.message);
            }
        }

        if (!text) throw new Error(lastError?.message || "AI response was empty.");
        res.json({ description: text.trim() });

    } catch (err) {
        console.error("AI Error:", err.message);
        let userMessage = err.message;

        if (userMessage.includes("404")) {
            userMessage = "The selected Gemini model is unavailable for this API key. Set GEMINI_MODEL=gemini-3.5-flash in server/.env and restart the server.";
        } else if (userMessage.includes("fetch failed")) {
            userMessage = "Could not reach Gemini API. Check internet connection, API access, and server firewall settings.";
        } else if (userMessage.includes("API key not valid") || userMessage.includes("API_KEY_INVALID")) {
            userMessage = "Gemini API key is invalid. Generate a new key from Google AI Studio and update server/.env.";
        }

        res.status(500).json({ message: userMessage });
    }
});

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
    if (req.user.role !== 'shopkeeper') return res.status(403).json({ message: 'Only shopkeepers can add products' });

    const { name, price, stockQuantity, lowStockLimit, description, image, category } = req.body;
    try {
        const newProduct = new Product({
            name,
            price,
            stockQuantity: Number(stockQuantity) || 0,
            lowStockLimit: Number(lowStockLimit) || 5,
            description,
            image,
            category,
            shopkeeperId: req.user.id
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

    const { name, price, stockQuantity, lowStockLimit, description, image, category } = req.body;
    try {
        let product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        if (product.shopkeeperId.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

        product = await Product.findByIdAndUpdate(req.params.id, {
            name,
            price,
            stockQuantity: Number(stockQuantity) || 0,
            lowStockLimit: Number(lowStockLimit) || 5,
            description,
            image,
            category
        }, { new: true });
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
