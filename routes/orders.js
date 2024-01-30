const express = require('express');
const router = express.Router();
const db = require('../database.js');
const passport = require('passport');

// Retrieve all orders for the current user
router.get('/orders', passport.authenticate('local'), async (req, res) => {
    try {
        const userId = req.user.id;

        // Retrieve all orders for the current user
        const getOrders = 'SELECT * FROM order_table WHERE userId = ?';
        const orders = await db.all(getOrders, [userId]);

        res.status(200).json({ message: 'Orders retrieved successfully', orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving orders' });
    }
});

// Retrieve details of a specific order
router.get('/orders/:orderId', passport.authenticate('local'), async (req, res) => {
    try {
        const userId = req.user.id;
        const orderId = req.params.orderId;

        // Retrieve the details of the specified order for the current user
        const getOrderDetails = 'SELECT * FROM order_table WHERE id = ? AND userId = ?';
        const order = await db.get(getOrderDetails, [orderId, userId]);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Retrieve the products associated with the order
        const getOrderProducts = 'SELECT p.id, p.name, p.description, op.quantity, p.price ' +
            'FROM order_product op ' +
            'JOIN product p ON op.productId = p.id ' +
            'WHERE op.orderId = ?';
        const products = await db.all(getOrderProducts, [orderId]);

        const orderDetails = { ...order, products };

        res.status(200).json({ message: 'Order details retrieved successfully', order: orderDetails });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving order details' });
    }
});

module.exports = router;