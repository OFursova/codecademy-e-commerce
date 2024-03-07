const express = require("express");
require('dotenv').config();

const expressLoader = require('./config/express');
const passportLoader = require('./config/passport');
const routeLoader = require('./routes');
const swaggerLoader = require('./config/swagger');

const { PORT } = require('./config');

const app = express();

async function startServer() {

    // Init application loaders
    const expressApp = await expressLoader(app);
    const passport = await passportLoader(expressApp);
    await routeLoader(app, passport);
    await swaggerLoader(app);

    //app.use(express.json());

    // Root endpoint
    app.get("/", (req, res, next) => {
        res.json({ "message": "Ok" })
    });

    // app.use((err, req, res, next) => {
    //     const { message, status = 404} = err;
    //     return res.status(status).send({ message });
    // });

    //Default response for any other request
    app.use(function (req, res) {
        res.status(404).send("Not Found");
    });


    // Start server
    app.listen(PORT, () => {
        console.log(`Server listening on PORT ${PORT}`);
    })
}

startServer();
