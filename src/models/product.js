import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    size: [{ type: String }],
    color: [{ type: String }],
    brand: { type: String },
    inStock: { type: Boolean, default: true },
    rating: { type: Number, min: 0, max: 5 },
    image: { type: String },
    description: { type: String }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

export default Product;
