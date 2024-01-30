const express = require("express");
const db = require("./database.js");
const passport = require('./passportConfig');
const md5 = require("md5");
const bodyParser = require("body-parser");

const authRoutes = require('./routes/auth.js');
const productRoutes = require('./routes/products.js');
const userRoutes = require('./routes/users.js');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.json());
app.use(require('express-session')({ secret: 'your-secret-key', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Root endpoint
app.get("/", (req, res, next) => {
    res.json({"message":"Ok"})
});

// Other API endpoints
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/users', userRoutes);

// Default response for any other request
app.use(function(req, res){
    res.status(404);
});

// Server port
const HTTP_PORT = 8000;
// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});
