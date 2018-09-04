const express = require("express");
const router = express.Router();
const ensureLogin = require("connect-ensure-login");
const Story = require("../models/Story");

router.use(ensureLogin.ensureLoggedIn("/auth/login"));

router.get("/map", (req, res, next) => {
    res.render("protected/map");
});

router.post("/create-story", (req, res, next) => {
    const address = {
        street: req.body.street,
        town: req.body.town,
        city: req.body.city,
        county: req.body.county,
        country: req.body.country
    };

    Object.keys(address).forEach(key => {
        const val = address[key];
        if (val === "undefined") delete address[key];
    });

    let story = new Story({
        story: req.body.story,
        creator: req.user._id,
        address,
        location: { lat: Number(req.body.lat), lng: Number(req.body.lng) }
    });
    story.save();
});

router.get("/stories", (req, res) => {
    Story.find({}).then(stories => {
        res.send(stories);
    });
});
// HELLO
module.exports = router;
