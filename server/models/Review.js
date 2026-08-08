const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true }, // Linked to the whole order
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, // Optional now
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    shopkeeperIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of shopkeepers in that order
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', ReviewSchema);
