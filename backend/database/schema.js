const { Client } = require('pg');
require('dotenv').config();
const { DB } = require('../config');

// Define SQL queries to create tables
const createTablesQuery = `
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
    username VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    google JSON,
    facebook JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
    name VARCHAR(255),
    description TEXT,
    price REAL,
    quantity_in_stock INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
    user_id BIGINT NOT NULL,
    status VARCHAR(255),
    total REAL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS carts (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS order_items (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT,
    price INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS cart_items (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
    cart_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT,
    FOREIGN KEY (cart_id) REFERENCES carts(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);
`;

// Define SQL queries to insert default rows
const insertDataQuery = `
INSERT INTO users (username, email, password) VALUES 
    ('john_doe', 'john@example.com', 'hashed_password_123'),
    ('jane_smith', 'jane@example.com', 'hashed_password_456');

INSERT INTO products (name, description, price, quantity_in_stock) VALUES 
    ('Premium Coffee Maker', 'State-of-the-art coffee brewing machine', 149.99, 30),
    ('Wireless Noise-Canceling Headphones', 'Immersive audio experience with noise-canceling technology', 199.99, 50);
`;

// Function to create tables and insert default rows
async function setupSchema() {
    const db = new Client({
        user: DB.PGUSER,
        host: DB.PGHOST,
        database: DB.PGDATABASE,
        password: DB.PGPASSWORD,
        port: DB.PGPORT
    });

    await db.connect();

    try {
        await db.query(createTablesQuery);
        await db.query(insertDataQuery);
        await db.end();

        console.log('Schema created and data inserted successfully');
    } catch (err) {
        console.error('Error setting up schema', err);
    }
}

setupSchema();