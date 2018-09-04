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
        creator: req.user._id,
        location: { lat: Number(req.body.lat), lng: Number(req.body.lng) }
    });
    story.save();
});

module.exports = router;
