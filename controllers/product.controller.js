const Product = require('../models/products.model');

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find({}, 'productId name expirationDate stock category');

        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Error occurred while fetching products.' });
    }
}