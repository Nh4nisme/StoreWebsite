const Product = require('../models/products.model');

exports.createProducts = async (req, res) => {
    console.log("Request body:", req.body);
    const { productId, name, category, price, stock, supplier, expirationDate } = req.body;

    if (!productId || !name || !category || !price || !stock || !supplier || !expirationDate) {
        return res.status(400).json({ message: 'All fields are required.' });
    }
    
    try {
        const newProduct = new Product({
            productId,
            name,
            category,
            price,
            stock,
            supplier,
            expirationDate,
        });

        const saveProduct = await newProduct.save();
        return res.status(200).json({
            message: 'Product save successfully bravooo!',
            product: saveProduct,
        });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'An error occurred while creating the product.' });
    }
}


// lay danh sach san pham
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();

        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Error occurred while fetching products.' });
    }
}