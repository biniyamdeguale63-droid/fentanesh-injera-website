import { Router, type IRouter } from "express";
import {
  GetPricingQueryParams,
  GetPricingResponse,
} from "@workspace/api-zod";
import { calculatePricing } from "../lib/pricing";

const router: IRouter = Router();

router.get("/pricing", (req, res): void => {
  const parsed = GetPricingQueryParams.safeParse(req.query);

  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.issues }, "Invalid pricing query");
    res.status(400).json({ error: "Enter a positive whole quantity and choose a teff type." });
    return;
  }

  const { qty, type } = parsed.data;
  if (!Number.isInteger(qty)) {
    res.status(400).json({ error: "Quantity must be a whole number." });
    return;
  }

  res.json(GetPricingResponse.parse(calculatePricing(qty, type)));
});

export default router;