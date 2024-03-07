const authRouter = require('./auth.js');
const cartRouter = require('./cart.js');
const orderRouter = require('./orders.js');
const productRouter = require('./products.js');
const userRouter = require('./users.js');

module.exports = (app, passport) => {
    authRouter(app, passport);
    cartRouter(app);
    orderRouter(app);
    productRouter(app);
    userRouter(app);
  }