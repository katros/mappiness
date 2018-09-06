const express = require('express');
const passport = require('passport');
const authRoutes = express.Router();
const User = require('../models/User');
const ensureLogin = require('connect-ensure-login');

// Bcrypt to encrypt passwords
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

authRoutes.get('/login', (req, res, next) => {
    res.render('auth/login', { message: req.flash('error') });
});

authRoutes.post(
    '/login',
    passport.authenticate('local', {
        successRedirect: '/protected/map',
        failureRedirect: '/auth/login',
        failureFlash: true,
        passReqToCallback: true
    })
);

authRoutes.get('/signup', (req, res, next) => {
    res.render('auth/signup');
});

authRoutes.post('/signup', (req, res, next) => {
    const { email, password } = req.body;

    User.findOne({ email }, 'email', (err, user) => {
        if (user !== null) {
            res.render('auth/signup', { message: 'The email already exists' });
            return;
        }

        const salt = bcrypt.genSaltSync(bcryptSalt);
        const hashPass = bcrypt.hashSync(password, salt);

        const newUser = new User({
            email,
            password: hashPass
        });

        newUser
            .save()
            .then(user => {
                const id = user._id;

                req.login(user, err => {
                    if (err) throw err;
                    res.redirect(`/auth/username/${id}`);
                });
            })
            .catch(err => {
                console.error(err);
                res.render('auth/signup', { message: 'Something went wrong' });
            });
    });
});

authRoutes.get('/username/:id', (req, res) => {
    if (req.user) {
        const userId = req.params.id;
        res.render('auth/username', { user: userId });
    } else res.redirect('/');
});

authRoutes.post('/username/:id', (req, res) => {
    const { id } = req.params;
    const { username } = req.body;

    User.findByIdAndUpdate(id, { username }, { runValidators: true }).then(user => {
        res.redirect('/protected/map');
    });
});

authRoutes.get(
    '/google',
    passport.authenticate('google', {
        scope: [
            'https://www.googleapis.com/auth/plus.login',
            'https://www.googleapis.com/auth/plus.profile.emails.read'
        ]
    })
);

authRoutes.get(
    '/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/auth/signin'
    }),
    (req, res) => {
        if (req.user.username === 'unknown') {
            let id = req.user._id;
            res.redirect(`/auth/username/${id}`);
        } else {
            res.redirect('/protected/map');
        }
    }
);

authRoutes.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = authRoutes;
