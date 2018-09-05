const express = require("express");
const router = express.Router();
const ensureLogin = require("connect-ensure-login");
const Story = require("../models/Story");
const moment = require("helper-moment");
const hbs = require("hbs");

hbs.registerHelper("moment", require("helper-moment"));

router.use(ensureLogin.ensureLoggedIn("/auth/login"));

router.get("/map", (req, res, next) => {
    res.render("protected/map");
});

router.post("/create-story", (req, res, next) => {
    let street = req.body.street === "undefined" ? "" : req.body.street;
    let city_district = req.body.city_district === "undefined" ? "" : req.body.city_district;
    let town = req.body.town === "undefined" ? "" : req.body.town;
    let city = req.body.city === "undefined" ? "" : req.body.city;
    let county = req.body.county === "undefined" ? "" : req.body.county;
    let country = req.body.country === "undefined" ? "" : req.body.country;

    let story = new Story({
        story: req.body.story,
        creatorId: req.user._id,
        username: req.user.username,
        address: {
            street,
            city_district,
            town,
            city,
            county,
            country
        },
        location: { lat: Number(req.body.lat), lng: Number(req.body.lng) }
    });
    story.save().then(result => {
        res.redirect("/protected/user-profile");
    });
});

router.get("/stories", (req, res) => {
    Story.find({}).then(stories => {
        res.send(stories);
    });
});

router.get("/user-profile", (req, res, next) => {
    let username = req.user.username;
    Story.find({ username })
        .sort([["updated_at", -1]])
        .then(stories => {
            let customStories = {
                username,
                stories
            };
            res.render("protected/user-profile", { customStories });
        })
        .catch(console.error);
});

//deleting story

router.post("/:id/delete", (req, res) => {
    Story.findByIdAndRemove(req.params.id)
        .then(result => {
            res.redirect("/protected/user-profile");
        })
        .catch(console.error);
});

//updating story
router.get("/:id/edit", (req, res) => {
    const { id } = req.params;
    Story.findById(id)
        .then(story => {
            res.render("protected/edit", { story });
        })
        .catch(console.error);
});

router.post("/:id", (req, res) => {
    const { id } = req.params;
    const { story } = req.body;

    Story.findByIdAndUpdate(
        id,
        {
            story
        },
        { new: true }
    )
        .then(story => {
            res.redirect("/protected/user-profile");
        })
        .catch(console.error);
});

// following
/*
Follow-Btn gets Id + username
adds name-link to user-profile
*/
router.get("/follow", function(req, res) {
    const followName = req.user.username;
    const followId = req.user.id;
    console.log("GET NAME:", followName);
    res.send({ msg: "User followed/unfollowed!" });
});

module.exports = router;
