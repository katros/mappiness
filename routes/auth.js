const express = require('express');
const passport = require('passport');
const authRoutes = express.Router();
const User = require('../models/User');

// Bcrypt to encrypt passwords
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

authRoutes.get('/login', (req, res, next) => {
    res.render('auth/login', { message: req.flash('error') });
});

authRoutes.post(
    '/login',
    passport.authenticate('local', {
        successRedirect: '/',
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

    if (password === '' || email === '') {
        res.render('auth/signup', { message: 'Indicate email and password' });
        return;
    }

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
                res.redirect(`username/${id}`);
            })
            .catch(err => {
                res.render('auth/signup', { message: 'Something went wrong' });
            });
    });
});

authRoutes.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

authRoutes.get('/username/:id', (req, res) => {
    const userId = req.params.id;
    res.render('auth/username', { user: userId });
});

authRoutes.post('/username/:id', (req, res) => {
    const { id } = req.params;
    const { username } = req.body;

    User.findByIdAndUpdate(id, { username }).then(user => {
        res.send('username was added!'); //redirect to global-map page
    });
});

module.exports = authRoutes;
