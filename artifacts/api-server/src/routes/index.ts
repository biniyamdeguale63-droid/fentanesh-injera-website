import { Router, type IRouter } from "express";
import healthRouter from "./health";
import pricingRouter from "./pricing";
import sampleRequestRouter from "./sample-request";

const router: IRouter = Router();

router.use(healthRouter);
router.use(pricingRouter);
router.use(sampleRequestRouter);

export default router;
