const express = require('express');
const router = express.Router();
const db = require('../database/pool');

// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
    console.log(req.isAuthenticated(), req.user);
    if (req.isAuthenticated() && req.user.email === 'admin@mail.com') {
        return next();
    } else {
        return res.status(403).json({ message: 'Permission denied' });
    }
};

// Create a new product (POST request)
router.post('/', isAdmin, async (req, res) => {
    try {
        const { name, description, price, quantity } = req.body;

        // Insert new product into the 'products' table
        const insertProduct = 'INSERT INTO products (name, description, price, quantity_in_stock) VALUES ($1, $2, $3, $4) RETURNING id';
        const result = await db.query(insertProduct, [name, description, price, quantity]);

        // Get the newly inserted product's ID
        const newProductId = result.rows[0].id;

        res.status(201).json({ message: 'Product created successfully', productId: newProductId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating product' });
    }
});

// Get all products (GET request)
router.get('/', async (req, res) => {
    try {
        // Retrieve all products from the 'products' table
        const result = await db.query('SELECT * FROM products');
        const products = result.rows;
        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving products' });
    }
});

// Update a product (PUT request)
router.put('/:productId', isAdmin, async (req, res) => {
    try {
        const productId = req.params.productId;
        const { name, description, price, quantity } = req.body;

        // Update the product in the 'products' table
        const updateProduct = 'UPDATE products SET name = $1, description = $2, price = $3, quantity = $4 WHERE id = $5';
        await db.query(updateProduct, [name, description, price, quantity, productId]);

        res.status(200).json({ message: 'Product updated successfully', productId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating product' });
    }
});

// Delete a product (DELETE request)
router.delete('/:productId', isAdmin, async (req, res) => {
    try {
        const productId = req.params.productId;

        // Delete the product from the 'products' table
        await db.query('DELETE FROM products WHERE id = $1', [productId]);

        res.status(200).json({ message: 'Product deleted successfully', productId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting product' });
    }
});

module.exports = router;
