import { Router, type IRouter } from "express";

const router: IRouter = Router();

const handler = async (req: any, res: any) => {
  console.log("--- REQUEST RECEIVED ---", req.body);
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (token && chatId) {
    try {
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: `📩 New B2B Request Received:\n\n${JSON.stringify(req.body, null, 2)}`,
        }),
      });
    } catch (err) {
      console.error("Telegram Error:", err);
    }
  } else {
    console.warn("TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID missing in .env");
  }

  return res.status(200).json({ success: true, message: "Request sent successfully!" });
};

router.post("/sample-request", handler);
router.post("/request-sample", handler);
router.post("/requests", handler);
router.post("/contact", handler);

export default router;
