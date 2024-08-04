// routes/products.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

// Add a product
router.post('/', [auth, [
    check('name', 'Name is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('price', 'Price is required').isNumeric(),
    check('stock', 'Stock is required').isNumeric(),
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, price, stock, image } = req.body;

    try {
        const newProduct = new Product({
            name,
            description,
            price,
            stock,
            image,
            seller: req.user.id
        });

        const product = await newProduct.save();
        res.json(product);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get product by ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }
        res.json(product);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Update a product
router.patch('/:id', auth, async (req, res) => {
    const { name, description, price, stock, image } = req.body;

    const productFields = { name, description, price, stock, image };

    try {
        let product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        // Ensure user owns the product
        if (product.seller.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        product = await Product.findByIdAndUpdate(req.params.id, { $set: productFields }, { new: true });

        res.json(product);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Delete a product
router.delete('/:id', auth, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        // Ensure user owns the product
        if (product.seller.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await Product.deleteOne({_id:req.params.id});

        res.json({ msg: 'Product removed' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
