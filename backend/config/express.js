const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const { SESSION_SECRET } = require('../config');
const helmet = require('helmet');

module.exports = (app) => {

  // Enable Cross Origin Resource Sharing to all origins by default
  app.use(cors());

  // Transforms raw string of req.body into JSON
  app.use(bodyParser.json());

  // Parses urlencoded bodies
  app.use(bodyParser.urlencoded({ extended: true }));

  app.set('trust proxy', 1);

  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-eval'"], // Allow 'unsafe-eval' for dynamic script evaluation
        // Add other directives as needed (e.g., styleSrc, fontSrc, etc.)
      },
    },
  }));

  // Creates a session
  app.use(
    session({  
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false,
        maxAge: 24 * 60 * 60 * 1000
      }
    })
  );

  return app;
  
}
