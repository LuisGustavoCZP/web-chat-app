import express from 'express';
import { Router } from 'express';
import { router as FrontendRouter } from "../../frontend";
import { router as UserRouter } from "../../users";

const router = Router(); 

router.use(UserRouter);
router.use(FrontendRouter);

export { router };