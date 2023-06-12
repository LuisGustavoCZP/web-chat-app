import { Router } from "express";
import { register, list, update, login, checkSelf } from "../controllers";
import { authPass } from "../middlewares";
import { logout } from "../controllers/users/logout";

const router = Router();

router.post("/login", login);

router.post("/users/", register);
router.get("/users/", authPass, list);
router.put("/users/", authPass, update);

router.get("/users/self", authPass, checkSelf);
router.delete("/logout", authPass, logout);

export {router};