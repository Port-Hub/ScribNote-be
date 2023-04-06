import { Router } from "express";
import preprocess from "./preprocess/preprocess.route";
import auth from "./auth/auth.route";
import user from "./user/user.route";
import validateUser from "../middleware/validateUser";
import upload from "./upload/upload.route";

const router: Router = Router();

router.use("/preprocess",preprocess);
router.use("/auth",auth);
router.use("/user",validateUser,user);
router.use("/upload",validateUser,upload);

export default router;