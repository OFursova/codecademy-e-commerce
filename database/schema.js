const pool = require('./pool');

// Define SQL queries to create tables
const createTablesQuery = `
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    description TEXT,
    price REAL,
    quantity_in_stock INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    status VARCHAR(255),
    total_amount REAL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS carts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_product (
    order_id INTEGER REFERENCES orders(id),
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER,
    PRIMARY KEY (order_id, product_id)
);

CREATE TABLE IF NOT EXISTS cart_product (
    cart_id INTEGER REFERENCES carts(id),
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER,
    PRIMARY KEY (cart_id, product_id)
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
    const client = await pool.connect();
    try {
        await client.query(createTablesQuery);
        await client.query(insertDataQuery);
        console.log('Schema created and data inserted successfully');
    } catch (err) {
        console.error('Error setting up schema', err);
    } finally {
        client.release(); // Release the client back to the pool
        pool.end(); // End the pool's process
    }
}

// Call the function to set up schema
setupSchema();