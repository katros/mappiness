const express = require('express');
const router = express.Router();
const ensureLogin = require('connect-ensure-login');
const Story = require('../models/Story');
const moment = require('helper-moment');
const hbs = require('hbs');

hbs.registerHelper('moment', require('helper-moment'));

router.use(ensureLogin.ensureLoggedIn('/auth/login'));

router.get('/map', (req, res, next) => {
    res.render('protected/map');
});

router.post('/create-story', (req, res, next) => {
    let street = req.body.street === 'undefined' ? '' : req.body.street;
    let town = req.body.town === 'undefined' ? '' : req.body.town;
    let city = req.body.city === 'undefined' ? '' : req.body.city;
    let county = req.body.county === 'undefined' ? '' : req.body.county;
    let country = req.body.country === 'undefined' ? '' : req.body.country;

    let story = new Story({
        story: req.body.story,
        creatorId: req.user._id,
        username: req.user.username,
        address: {
            street,
            town,
            city,
            county,
            country
        },
        location: { lat: Number(req.body.lat), lng: Number(req.body.lng) }
    });
    story.save();
});

router.get('/stories', (req, res) => {
    Story.find({}).then(stories => {
        res.send(stories);
    });
});

router.get('/user-profile', (req, res, next) => {
    let username = req.user.username;
    Story.find({ username })
        .then(stories => {
            let customStories = {
                username,
                stories
            };
            res.render('protected/user-profile', { customStories });
        })
        .catch(console.error);
});

module.exports = router;
