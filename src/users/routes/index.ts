import { Router } from "express";
import { register, list, update, login } from "../controllers";

const router = Router();

router.post("/users/", register);
router.get("/users/", list);
router.patch("/users/", update);

router.get('/login', login);

export {router};