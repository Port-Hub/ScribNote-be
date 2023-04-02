import { Router } from "express";
import preprocess from "./preprocess/preprocess.route";
import auth from "./auth/auth.route";

// import { validateUser } from "../middlewares/validate";

const router: Router = Router();

router.use("/preprocess",preprocess);
router.use("/auth",auth);

export default router;