import { Router, type IRouter } from "express";
import fs from "fs";
import path from "path";

const router: IRouter = Router();
const dataFile = path.join(process.cwd(), "site-settings.json");

function readSettings() {
  try {
    const raw = fs.readFileSync(dataFile, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    return {
      white: 25,
      red: 22,
      minOrder: 50,
      phone: "+251923065023",
      email: "fentanesh2321@gmail.com",
      address: "ቢቸና መሀል አደባባይ",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=10.4506883,38.1994662",
    };
  }
}

router.get("/settings", (req, res) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate");
  res.status(200).json(readSettings());
});

router.post("/settings", (req, res) => {
  const password = req.body ? req.body.password : undefined;
  if (password !== process.env.OWNER_PASSWORD) {
    return res.status(401).json({ success: false, message: "Wrong password" });
  }
  const current = readSettings();
  const whiteVal = parseFloat(req.body.white);
  const redVal = parseFloat(req.body.red);
  const minOrderVal = parseInt(req.body.minOrder, 10);
  const phoneVal = typeof req.body.phone === "string" && req.body.phone.trim() !== "" ? req.body.phone.trim() : current.phone;
  const emailVal = typeof req.body.email === "string" && req.body.email.trim() !== "" ? req.body.email.trim() : current.email;
  const addressVal = typeof req.body.address === "string" && req.body.address.trim() !== "" ? req.body.address.trim() : current.address;
  const mapsUrlVal = typeof req.body.mapsUrl === "string" && req.body.mapsUrl.trim() !== "" ? req.body.mapsUrl.trim() : current.mapsUrl;
  const updated = {
    white: isNaN(whiteVal) ? current.white : whiteVal,
    red: isNaN(redVal) ? current.red : redVal,
    minOrder: isNaN(minOrderVal) ? current.minOrder : minOrderVal,
    phone: phoneVal,
    email: emailVal,
    address: addressVal,
    mapsUrl: mapsUrlVal,
  };
  fs.writeFileSync(dataFile, JSON.stringify(updated, null, 2));
  res.status(200).json({ success: true, ...updated });
});

export default router;
