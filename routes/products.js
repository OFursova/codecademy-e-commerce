const express = require('express');
const router = express.Router();
const db = require('../database/pool');

// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.email === 'admin@mail.com') {
        return next();
    } else {
        return res.status(403).json({ message: 'Permission denied' });
    }
};

// Create a new product (POST request)
router.post('/', isAdmin, async (req, res) => {
    try {
        const { name, description, price, quantityInStock } = req.body;

        // Insert new product into the 'product' table
        const insertProduct = 'INSERT INTO product (name, description, price, quantityInStock) VALUES (?, ?, ?, ?)';
        const result = await db.run(insertProduct, [name, description, price, quantityInStock]);

        // Get the newly inserted product's ID
        const newProductId = result.lastID;

        res.status(201).json({ message: 'Product created successfully', productId: newProductId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating product' });
    }
});

// Get all products (GET request)
router.get('/', async (req, res) => {
    try {
        // Retrieve all products from the 'product' table
        const products = await db.all('SELECT * FROM product');
    console.log(result, products);
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
        const { name, description, price, quantityInStock } = req.body;

        // Update the product in the 'product' table
        const updateProduct = 'UPDATE product SET name=?, description=?, price=?, quantityInStock=? WHERE id=?';
        await db.run(updateProduct, [name, description, price, quantityInStock, productId]);

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

        // Delete the product from the 'product' table
        const deleteProduct = 'DELETE FROM product WHERE id=?';
        await db.run(deleteProduct, [productId]);

        res.status(200).json({ message: 'Product deleted successfully', productId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting product' });
    }
});

module.exports = router;
