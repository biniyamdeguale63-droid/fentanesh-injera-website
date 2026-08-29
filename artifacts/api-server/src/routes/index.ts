import { Router, type IRouter } from "express";
import healthRouter from "./health";
import pricingRouter from "./pricing";
import sampleRequestRouter from "./sample-request";
import settingsRouter from "./settings";

const router: IRouter = Router();

router.use(healthRouter);
router.use(pricingRouter);
router.use(sampleRequestRouter);
router.use(settingsRouter);

export default router;
