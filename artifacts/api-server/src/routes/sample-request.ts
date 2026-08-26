import { randomUUID } from "node:crypto";
import { Router, type IRouter } from "express";
import {
  RequestSampleBody,
  RequestSampleResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/request-sample", (req, res): void => {
  const parsed = RequestSampleBody.safeParse(req.body);

  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.issues }, "Invalid sample request");
    res.status(400).json({
      error: "Please check your name, business, contact details, and quantity.",
    });
    return;
  }

  if (!Number.isInteger(parsed.data.quantity)) {
    res.status(400).json({ error: "Quantity must be a whole number." });
    return;
  }

  const request = {
    id: `sample-${randomUUID()}`,
    status: "received" as const,
    submittedAt: new Date(),
    ...parsed.data,
  };

  req.log.info(
    { requestId: request.id, business: request.business },
    "Sample request received",
  );
  res.status(201).json(RequestSampleResponse.parse(request));
});

export default router;