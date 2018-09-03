const express = require('express');
const router = express.Router();
const ensureLogin = require('connect-ensure-login');

router.use(ensureLogin.ensureLoggedIn('/auth/login'));

router.get('/map', (req, res, next) => {
    res.render('protected/map');
});

module.exports = router;
