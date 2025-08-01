import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const botToken = process.env.BOT_TOKEN;
const chatId = process.env.CHAT_ID;

export async function sendText(message) {
  return await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    chat_id: chatId,
    text: message,
  });
}

export async function sendPhoto(buffer) {
  const formData = new FormData();
  formData.append("chat_id", chatId);
  formData.append("photo", new Blob([buffer]), "screenshot.png");

  return await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
    method: "POST",
    body: formData,
  });
}
