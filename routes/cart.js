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
        const result = await db.query('INSERT INTO carts (user_id) VALUES ($1) RETURNING *', [userId]);

        // Get the newly inserted cart's ID
        const newCartId = result.rows[0].id;

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
        const product = await db.query('SELECT * FROM products WHERE id = $1', [productId]);

        if (product.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if the cart belongs to the current user
        const cart = await db.query('SELECT * FROM carts WHERE id = $1 AND user_id = $2', [cartId, userId]);

        if (cart.rows.length === 0) {
            return res.status(403).json({ message: 'Unauthorized access to the cart' });
        }

        // Insert product into the 'cart_product' table
        await db.query('INSERT INTO cart_product (cart_id, product_id, quantity) VALUES ($1, $2, $3)', [cartId, productId, quantity]);

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
        const cart = await db.query('SELECT * FROM carts WHERE id = $1 AND user_id = $2', [cartId, userId]);

        if (!cart) {
            return res.status(403).json({ message: 'Unauthorized access to the cart' });
        }

        // Retrieve products associated with the specified cart
        const getProductsInCart = 'SELECT p.id, p.name, p.description, p.price, cp.quantity FROM products p JOIN cart_product cp ON p.id = cp.product_id WHERE cp.cart_id = $1';
        const products = await db.query(getProductsInCart, [cartId]);

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
        const cart = await db.query('SELECT * FROM carts WHERE id = $1 AND user_id = $2', [cartId, userId]);

        if (!cart) {
            return res.status(403).json({ message: 'Unauthorized access to the cart' });
        }

        // Check if the cart has any products
        const cartProducts = await db.query('SELECT * FROM cart_product WHERE cart_id = $1', [cartId]);

        if (cartProducts.rows.length === 0) {
            return res.status(400).json({ message: 'Cannot checkout an empty cart' });
        }

        // Mock payment processing logic (assuming payment is successful)
        const paymentSuccess = true;
        if (!paymentSuccess) {
            return res.status(400).json({ message: 'Payment failed' });
        }

        try {
            await db.query('BEGIN');
        
            // Create an order reflecting the successful payment
            const createOrder = 'INSERT INTO orders (user_id, status, total_amount) VALUES ($1, $2, $3) RETURNING id';
            const totalAmount = cartProducts.rows.reduce((acc, product) => acc + (product.price * product.quantity), 0);
            const orderResult = await db.query(createOrder, [userId, 'completed', totalAmount]);
            const orderId = orderResult.rows[0].id;
        
            // Move cart products to order_products table (representing the purchased products in the order)
            const moveCartProducts = 'INSERT INTO order_product (order_id, product_id, quantity) VALUES ($1, $2, $3)';
            for (const product of cartProducts.rows) {
                await db.query(moveCartProducts, [orderId, product.productId, product.quantity]);
            }
        
            // Clear the cart by removing associated cart products
            await db.query('DELETE FROM cart_product WHERE cart_id = $1', [cartId]);
        
            await db.query('COMMIT');
        
            res.status(200).json({ message: 'Order created successfully', orderId });
        } catch (error) {
            await db.query('ROLLBACK');
            console.error(error);
            res.status(500).json({ message: 'Error creating order' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error during checkout' });
    }
});


module.exports = router;
