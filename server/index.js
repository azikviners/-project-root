import express from "express";
import multer from "multer";
import { sendPhoto, sendText } from "./telegram.js";

const app = express();
const upload = multer();

app.use(express.json());
app.use(express.static("public"));

app.post("/send-text", async (req, res) => {
  const { message } = req.body;
  const result = await sendText(message);
  res.json({ ok: true, result });
});

app.post("/send-photo", upload.single("screenshot"), async (req, res) => {
  const result = await sendPhoto(req.file.buffer);
  res.json({ ok: true, result });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
