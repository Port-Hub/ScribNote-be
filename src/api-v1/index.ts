import { validateUser, validateNotes } from "../middleware/validate";
import { Router } from "express";

import auth from "./auth/auth.route";
import user from "./user/user.route";
import upload from "./upload/upload.route";
import gen from "./gen/gen.route";
import access from "./access/access.route";
import update from "./update/update.route";

const router: Router = Router();

router.use("/auth",auth);

router.use("/user",validateUser,user);
router.use("/update",validateUser,update);
router.use("/upload",validateUser,upload);

router.use("/access",validateUser,validateNotes,access);
router.use("/generate",validateUser,validateNotes,gen);

export default router;