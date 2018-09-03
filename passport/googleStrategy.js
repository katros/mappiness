const passport = require('passport');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const config = require('../config');

passport.use(
    new GoogleStrategy(
        {
            clientID: config.GOOGLE_CLIENT_ID,
            clientSecret: config.GOOGLE_CLIENT_SECRET,
            callbackURL: '/auth/google/callback'
        },
        (accessToken, refreshToken, profile, done) => {
            const email = profile.emails[0].value;
            User.findOne({ $or: [{ googleId: profile.id }, { email }] })
                .then(user => {
                    if (user) {
                        if (!user.googleId) user.googleId = profile.id;

                        user.save(() => {});

                        return done(null, user);
                    }

                    const newUser = new User({
                        googleId: profile.id,
                        email
                    });

                    newUser.save().then(user => {
                        done(null, newUser);
                    });
                })
                .catch(error => {
                    done(error);
                });
        }
    )
);
