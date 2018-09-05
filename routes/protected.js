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
    Story.find({}).then(stories => {
        res.send(stories);
    });
});

//logged user profile page

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

//random user profile page

router.get("/user/:username", (req, res, next) => {
    const username = req.params.username;
    const currUser = req.user.username;

    if (username !== currUser) {
        Story.find({ username })
            .sort([["updated_at", -1]])
            .then(stories => {
                let userStories = {
                    username,
                    stories
                };
                res.render("protected/user", { userStories });
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
    const username = req.params.username; //user we want to follow
    const id = req.user.id; // own id

    User.findOne({ username }).then(user => {
        User.findOne({ _id: id }, (err, res) => {
            if (err) console.log(err);

            // if it does NOT find user = -1
            if (res.following.indexOf(user.username) === -1) {
                //push element from res.following and .save()
                User.findByIdAndUpdate(
                    { _id: id },
                    { $push: { following: user.username } },
                    { new: true }
                ).then(user => {
                    console.log("USER:", user);
                    response.send(user);
                });
            } else {
                // remove element in res.following and .save()
                User.findByIdAndUpdate(
                    { _id: id },
                    { $pull: { following: user.username } },
                    { new: true }
                ).then(user => {
                    console.log("USER REMOVE:", user);
                    response.send(user);
                });
            }
        });
    });
});

/*

Helene, find first the user we want to follow (user.find(username:req.params.username)
.then(userWeWantToFollow => User.find(currentUser).exec(check if we have the userWeWantToFollow.id
    in the currentUser.following array, if we have it we remove it, if we don’t have it we add it)

*/

module.exports = router;
