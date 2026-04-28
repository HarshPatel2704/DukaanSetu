const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, default: 'General' }, // Added category
    description: { type: String, required: true },
    image: { type: String, default: 'https://via.placeholder.com/150' }, // Image URL
    shopkeeperId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', ProductSchema);
