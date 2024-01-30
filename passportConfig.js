const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('./database.js');

passport.use(new LocalStrategy((username, password, done) => {
    // Verify the user in your database
    db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, user) => {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, { message: 'Incorrect username or password' });
        }
        return done(null, user);
    });
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    // Retrieve the user from your database
    db.get('SELECT * FROM users WHERE id = ?', [id], (err, user) => {
        done(err, user);
    });
});

module.exports = passport;
