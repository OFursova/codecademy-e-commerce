const express = require('express');
const router = express.Router();
const db = require('../database/pool');
const passport = require('passport');

// Retrieve all orders for the current user
router.get('/', passport.authenticate('local'), async (req, res) => {
    try {
        const userId = req.user.id;

        // Retrieve all orders for the current user
        const getOrders = 'SELECT * FROM orders WHERE user_id = $1';
        const orders = await db.query(getOrders, [userId]);

        res.status(200).json({ message: 'Orders retrieved successfully', orders: orders.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving orders' });
    }
});

// Retrieve details of a specific order
router.get('/:orderId', passport.authenticate('local'), async (req, res) => {
    try {
        const userId = req.user.id;
        const orderId = req.params.orderId;

        // Retrieve the details of the specified order for the current user
        const getOrderDetails = 'SELECT * FROM orders WHERE id = $1 AND user_id = $2';
        const orderResult = await db.query(getOrderDetails, [orderId, userId]);
        const order = orderResult.rows[0];

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Retrieve the products associated with the order
        const getOrderProducts = 'SELECT p.id, p.name, p.description, op.quantity, p.price ' +
            'FROM order_product op ' +
            'JOIN product p ON op.product_id = p.id ' +
            'WHERE op.order_id = $1';
        const productsResult = await db.query(getOrderProducts, [orderId]);
        const products = productsResult.rows;

        const orderDetails = { ...order, products };

        res.status(200).json({ message: 'Order details retrieved successfully', order: orderDetails });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving order details' });
    }
});

module.exports = router;