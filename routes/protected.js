const express = require("express");
const router = express.Router();
const ensureLogin = require("connect-ensure-login");
const Story = require("../models/Story");
const User = require("../models/User");
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
    let user = req.user.username;
    let followingList = req.user.following;

    Story.find({}).then(stories => {
        let markerInfo = {
            stories,
            user,
            followingList
        };
        res.send(markerInfo);
    });
});

//logged user profile page

router.get("/user-profile", (req, res, next) => {
    let user = req.user;
    let username = req.user.username;
    Story.find({ username })
        .sort([["updated_at", -1]])
        .then(stories => {
            let customStories = {
                user,
                stories
            };
            res.render("protected/user-profile", { customStories });
        })
        .catch(console.error);
});

//random user profile page

router.get("/user/:username", (req, res, next) => {
    const username = req.params.username;
    const currUser = req.user.username;

    let followingList;

    if (username !== currUser) {
        Story.find({ username })
            .sort([["updated_at", -1]])
            .then(stories => {
                User.findOne({ username }).then(user => {
                    followingList = user.following; // req.user.following;
                    let isFollowing = false;
                    if (followingList.includes(username)) {
                        isFollowing = true;
                    }
                    let userStories = {
                        username,
                        stories,
                        followingList
                    };

                    res.render("protected/user", {
                        userStories,
                        isOwn: username === currUser,
                        isFollowing: isFollowing ? true : undefined
                    });
                });
            })
            .catch(console.error);
    } else {
        res.redirect("/protected/user-profile");
    }
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

router.get("/follow/:username", (req, response) => {
    const username = req.params.username;
    const id = req.user.id;

    User.findOne({ username }).then(user => {
        User.findOne({ _id: id }, (err, res) => {
            if (err) console.log(err);

            // if it does NOT find user = -1
            if (res.following.indexOf(user.username) === -1) {
                User.findByIdAndUpdate(
                    { _id: id },
                    { $push: { following: user.username } },
                    { new: true }
                ).then(user => {
                    response.send(user);
                });
            } else {
                User.findByIdAndUpdate(
                    { _id: id },
                    { $pull: { following: user.username } },
                    { new: true }
                ).then(user => {
                    response.send(user);
                });
            }
        });
    });
});

module.exports = router;
