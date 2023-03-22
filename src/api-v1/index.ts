import { Router } from "express";
import summarize from "./summarize/summarize.route";
import analyse from "./analyse/analyse.route";
import auth from "./auth/auth.route";

// import { validateUser } from "../middlewares/validate";

const router: Router = Router();

router.use("/summarize", summarize);
router.use("/analyse", analyse);
router.use("/auth",auth);

export default router;