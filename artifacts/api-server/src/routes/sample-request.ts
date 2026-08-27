import { randomUUID } from "node:crypto";
import { Router, type IRouter } from "express";
import { ReplitConnectors } from "@replit/connectors-sdk";
import {
  RequestSampleBody,
  RequestSampleResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();
const telegramChatId = process.env.TELEGRAM_CHAT_ID ?? "8214073133";

async function sendTelegramNotification(request: {
  id: string;
  name: string;
  business: string;
  email: string;
  phone: string;
  quantity: number;
  message?: string;
}): Promise<void> {
  const connectors = new ReplitConnectors();
  const text = [
    "New sample request received",
    "",
    `Business: ${request.business}`,
    `Contact name: ${request.name}`,
    `Phone: ${request.phone}`,
    `Email: ${request.email}`,
    `Quantity: ${request.quantity}`,
    request.message ? `Message: ${request.message}` : undefined,
    `Request ID: ${request.id}`,
  ]
    .filter((line): line is string => Boolean(line))
    .join("\n");

  const response = await connectors.proxy("telegram", "/sendMessage", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: telegramChatId,
      text,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Telegram notification failed (${response.status}): ${errorBody}`,
    );
  }
}

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
  void sendTelegramNotification(request).catch((err: unknown) => {
    req.log.error({ err, requestId: request.id }, "Failed to send Telegram message");
  });

  res.status(201).json(RequestSampleResponse.parse(request));
});

export default router;