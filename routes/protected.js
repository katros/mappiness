const express = require('express');
const router = express.Router();
const ensureLogin = require('connect-ensure-login');
const Story = require('../models/Story');

router.use(ensureLogin.ensureLoggedIn('/auth/login'));

router.get('/map', (req, res, next) => {
    res.render('protected/map');
});

router.post('/create-story', (req, res, next) => {
    let story = new Story({
        story: req.body.story,
        creatorId: req.user._id,
        username: req.user.username,
        address: {
            street: req.body.street,
            town: req.body.town,
            city: req.body.city,
            county: req.body.county,
            country: req.body.country
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

module.exports = router;
