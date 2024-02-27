const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('./database/pool');
const bcrypt = require('bcrypt');

passport.use(new LocalStrategy({
    usernameField: 'email', // Specify the field name for the email
    passwordField: 'password' // Specify the field name for the password
}, async (email, password, done) => {

    // Verify the user in your database
    try {
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);

        const user = result.rows[0];
        if (!user) {
            return done(null, false, { message: 'Incorrect email or password' });
        }
        //Compare hashed passwords
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                return done(err);
            }
            if (!isMatch) {
                return done(null, false, { message: 'Incorrect email or password' });
            }
            return done(null, user);
        });
        // if (user.password !== password) {
        //     return done(null, false, { message: 'Incorrect email or password' });
        // }

        //return done(null, user);

    } catch (err) {
        return done(err);
    }
})
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    // Retrieve the user from your database
    try {
        const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
        const user = result.rows[0];
        done(null, user);
    } catch (err) {
        done(err);
    }
});

module.exports = passport;
