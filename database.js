const sqlite3 = require('sqlite3').verbose();
const md5 = require('md5');

const DBSOURCE = "db.sqlite";

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        // Cannot open database
        console.error(err.message);
        throw err;
    } else {
        console.log('Connected to the SQLite database.');

        // Create User table
        db.run(`CREATE TABLE IF NOT EXISTS user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT,
            email TEXT UNIQUE,
            password TEXT,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Create Product table
        db.run(`CREATE TABLE IF NOT EXISTS product (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            description TEXT,
            price REAL,
            quantityInStock INTEGER,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Create Order table
        db.run(`CREATE TABLE IF NOT EXISTS order_table (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER,
            status TEXT,
            totalAmount REAL,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (userId) REFERENCES user (id)
        )`);

        // Create Cart table
        db.run(`CREATE TABLE IF NOT EXISTS cart (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (userId) REFERENCES user (id)
        )`);

        // Create OrderProduct and CartProduct (Many-to-Many relationship) tables
        db.run(`CREATE TABLE IF NOT EXISTS order_product (
            orderId INTEGER,
            productId INTEGER,
            quantity INTEGER,
            PRIMARY KEY (orderId, productId),
            FOREIGN KEY (orderId) REFERENCES order_table (id),
            FOREIGN KEY (productId) REFERENCES product (id)
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS cart_product (
            cartId INTEGER,
            productId INTEGER,
            quantity INTEGER,
            PRIMARY KEY (cartId, productId),
            FOREIGN KEY (cartId) REFERENCES cart (id),
            FOREIGN KEY (productId) REFERENCES product (id)
        )`);

        // Insert sample users
        const insertUser = 'INSERT INTO user (username, email, password) VALUES (?,?,?)';
        db.run(insertUser, ["john_doe", "john@example.com", "hashed_password_123"]);
        db.run(insertUser, ["jane_smith", "jane@example.com", "hashed_password_456"]);

        // Insert sample products
        const insertProduct = 'INSERT INTO product (name, description, price, quantityInStock) VALUES (?,?,?,?)';
        db.run(insertProduct, ["Premium Coffee Maker", "State-of-the-art coffee brewing machine", 149.99, 30]);
        db.run(insertProduct, ["Wireless Noise-Canceling Headphones", "Immersive audio experience with noise-canceling technology", 199.99, 50]);

        // Insert sample orders
        const insertOrder = 'INSERT INTO order_table (userId, status, totalAmount) VALUES (?,?,?)';
        db.run(insertOrder, [1, "completed", 549.98]);
        db.run(insertOrder, [2, "pending", 299.99]);

        // Insert sample carts
        const insertCart = 'INSERT INTO cart (userId) VALUES (?)';
        db.run(insertCart, [1]);
        db.run(insertCart, [2]);

        // Insert sample order_product
        const insertOrderProduct = 'INSERT INTO order_product (orderId, productId, quantity) VALUES (?,?,?)';
        db.run(insertOrderProduct, [1, 1, 2]);
        db.run(insertOrderProduct, [2, 2, 1]);

        // Insert sample cart_product
        const insertCartProduct = 'INSERT INTO cart_product (cartId, productId, quantity) VALUES (?,?,?)';
        db.run(insertCartProduct, [1, 1, 1]);
        db.run(insertCartProduct, [2, 2, 3]);

    }
});

module.exports = db;
