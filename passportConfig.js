const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('./database.js');

passport.use(new LocalStrategy((username, password, done) => {
    console.log(db.get('SELECT * FROM user WHERE username = ? AND password = ?', [username, password]));
    // Verify the user in your database
    db.get('SELECT * FROM user WHERE username = ? AND password = ?', [username, password], (err, user) => {
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
    db.get('SELECT * FROM user WHERE id = ?', [id], (err, user) => {
        done(err, user);
    });
});

module.exports = passport;
