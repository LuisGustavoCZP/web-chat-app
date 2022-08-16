const express = require('express');

const controllers = require('../controllers');
const views = require('../views');

const router = express.Router();

router.use('/styles/style.css', views.sendGlobalStyle);

router.use('/scripts/input.js', views.sendInputScript);

router.use('/scripts/index.js', views.sendIndexScript);

router.use('/scripts/login.js', views.sendLoginScript);

router.use('/images/logo.png', views.sendLogoIcon);
router.use('/favicon.png', views.sendLogoIcon);

router.get('/emojis/', views.emojis);

router.get('/login', controllers.loginRoute);

router.use('/home/:sessionid', views.sendHomePage);

router.use('/', views.sendLoginPage);
//router.all('/', (req, res) => res.send('Hi there!'));


module.exports = router;