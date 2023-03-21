import { Router } from "express";
import summarize from "./summarize/summarize.route";
import analyse from "./analyse/analyse.route";

// import { validateUser } from "../middlewares/validate";

const router: Router = Router();

router.use("/summarize", summarize);
router.use("/analyse", analyse);

export default router;