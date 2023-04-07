import { Router } from "express";
import preprocess from "./preprocess/preprocess.route";
import auth from "./auth/auth.route";
import user from "./user/user.route";
import validateUser from "../middleware/validateUser";
import upload from "./upload/upload.route";
import findID from "../middleware/findID";
import gen from "./gen/gen.route";

const router: Router = Router();

router.use("/preprocess",preprocess);
router.use("/auth",auth);
router.use("/user",validateUser,user);
router.use("/upload",validateUser,upload);
router.use("/generate",findID,gen);

export default router;