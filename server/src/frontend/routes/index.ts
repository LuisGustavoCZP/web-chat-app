import * as views from "../views";
import { Router } from 'express';

const router = Router(); 

router.get('/emojis/', views.sendEmojis);

export { router };