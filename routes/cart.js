const express = require('express');
const router = express.Router();
const db = require('../database/pool');
const passport = require('passport');

// Create a new cart for a user
router.post('/cart', passport.authenticate('local'), async (req, res) => {
    try {
        // Passport sets the user object in the request after successful authentication
        const userId = req.user.id;

        // Insert new cart into the 'cart' table
        const insertCart = 'INSERT INTO cart (userId) VALUES (?)';
        const result = await db.run(insertCart, [userId]);

        // Get the newly inserted cart's ID
        const newCartId = result.lastID;

        res.status(201).json({ message: 'Cart created successfully', cartId: newCartId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating cart' });
    }
});

// Add a product to an existing cart
router.post('/cart/:cartId', passport.authenticate('local'), async (req, res) => {
    try {
        const cartId = req.params.cartId;
        const { productId, quantity } = req.body;
        const userId = req.user.id;

        // Check if the product exists
        const checkProduct = 'SELECT * FROM product WHERE id = ?';
        const product = await db.get(checkProduct, [productId]);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if the cart belongs to the current user
        const checkCartOwnership = 'SELECT * FROM cart WHERE id = ? AND userId = ?';
        const cart = await db.get(checkCartOwnership, [cartId, userId]);

        if (!cart) {
            return res.status(403).json({ message: 'Unauthorized access to the cart' });
        }

        // Insert product into the 'cart_product' table
        const insertProductToCart = 'INSERT INTO cart_product (cartId, productId, quantity) VALUES (?, ?, ?)';
        await db.run(insertProductToCart, [cartId, productId, quantity]);

        res.status(201).json({ message: 'Product added to cart successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding product to cart' });
    }
});


// Retrieve products in a specific cart
router.get('/cart/:cartId', passport.authenticate('local'), async (req, res) => {
    try {
        const cartId = req.params.cartId;
        const userId = req.user.id;

        // Check if the cart belongs to the current user
        const checkCartOwnership = 'SELECT * FROM cart WHERE id = ? AND userId = ?';
        const cart = await db.get(checkCartOwnership, [cartId, userId]);

        if (!cart) {
            return res.status(403).json({ message: 'Unauthorized access to the cart' });
        }

        // Retrieve products associated with the specified cart
        const getProductsInCart = 'SELECT p.id, p.name, p.description, p.price, cp.quantity FROM product p JOIN cart_product cp ON p.id = cp.productId WHERE cp.cartId = ?';
        const products = await db.all(getProductsInCart, [cartId]);

        res.status(200).json({ message: 'Products retrieved successfully', products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving products from cart' });
    }
});

// Checkout a cart
router.post('/cart/:cartId/checkout', passport.authenticate('local'), async (req, res) => {
    try {
        const cartId = req.params.cartId;
        const userId = req.user.id;

        // Check if the cart belongs to the current user
        const checkCartOwnership = 'SELECT * FROM cart WHERE id = ? AND userId = ?';
        const cart = await db.get(checkCartOwnership, [cartId, userId]);

        if (!cart) {
            return res.status(403).json({ message: 'Unauthorized access to the cart' });
        }

        // Check if the cart has any products
        const checkCartProducts = 'SELECT * FROM cart_product WHERE cartId = ?';
        const cartProducts = await db.all(checkCartProducts, [cartId]);

        if (cartProducts.length === 0) {
            return res.status(400).json({ message: 'Cannot checkout an empty cart' });
        }

        // Mock payment processing logic (assuming payment is successful)
        const paymentSuccess = true;
        if (!paymentSuccess) {
            return res.status(400).json({ message: 'Payment failed' });
        }

        // Create an order reflecting the successful payment
        const createOrder = 'INSERT INTO order_table (userId, status, totalAmount) VALUES (?, ?, ?)';
        const totalAmount = cartProducts.reduce((acc, product) => acc + (product.price * product.quantity), 0);
        const orderId = await db.run(createOrder, [userId, 'completed', totalAmount]);

        // Move cart products to order_products table (representing the purchased products in the order)
        const moveCartProducts = 'INSERT INTO order_product (orderId, productId, quantity) VALUES (?, ?, ?)';
        for (const product of cartProducts) {
            await db.run(moveCartProducts, [orderId.lastID, product.productId, product.quantity]);
        }

        // Clear the cart by removing associated cart products
        const clearCart = 'DELETE FROM cart_product WHERE cartId = ?';
        await db.run(clearCart, [cartId]);

        res.status(200).json({ message: 'Checkout successful', orderId: orderId.lastID });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error during checkout' });
    }
});


module.exports = router;
