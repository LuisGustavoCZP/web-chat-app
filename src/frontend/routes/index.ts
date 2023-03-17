import * as views from "../views";
import { Router } from 'express';

const router = Router(); 

router.use('/styles/style.css', views.sendGlobalStyle);

router.use('/scripts/:script', views.sendScript);

router.use('/images/logo.png', views.sendLogoIcon);

router.use('/favicon.png', views.sendLogoIcon);

router.get('/emojis/', views.sendEmojis);

router.use('/home/:sessionid', views.sendHomePage);

router.use('/', views.sendLoginPage);

export { router };