let panel, input, replyBox;

async function sendToServer(data, type = "text") {
  if (type === "photo") {
    const formData = new FormData();
    formData.append("screenshot", data, "screenshot.png");
    await fetch("/send-photo", { method: "POST", body: formData });
  } else {
    await fetch("/send-text", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: data })
    });
  }
}

function createPanel() {
  panel = document.createElement("div");
  panel.style = "position:fixed;bottom:20px;right:20px;z-index:999999;background:white;padding:10px;border-radius:10px;box-shadow:0 0 10px rgba(0,0,0,0.3);font-family:sans-serif;max-width:300px;";
  input = document.createElement("input");
  input.placeholder = "Напиши как ассистент...";
  input.style = "width:100%;padding:5px;margin-bottom:5px;";
  const btn = document.createElement("button");
  btn.textContent = "Отправить";
  btn.style = "width:100%;padding:5px;";
  replyBox = document.createElement("div");
  replyBox.style = "margin-top:5px;font-size:14px;color:#333;";
  btn.onclick = async () => {
    const msg = input.value.trim();
    if (msg) {
      await sendToServer("Ответ как ассистент: " + msg);
      input.value = "";
      replyBox.textContent = "✔ Отправлено";
    }
  };
  panel.appendChild(input);
  panel.appendChild(btn);
  panel.appendChild(replyBox);
  document.body.appendChild(panel);
}

function captureAndSendScreenshot() {
  navigator.mediaDevices.getDisplayMedia({ video: true }).then(stream => {
    const track = stream.getVideoTracks()[0];
    const imageCapture = new ImageCapture(track);
    imageCapture.grabFrame().then(bitmap => {
      track.stop();
      const canvas = document.createElement("canvas");
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(bitmap, 0, 0);
      canvas.toBlob(blob => sendToServer(blob, "photo"));
    });
  });
}

document.addEventListener("contextmenu", e => {
  e.preventDefault();
  captureAndSendScreenshot();
  createPanel();
});

document.addEventListener("click", () => {
  if (panel) panel.remove();
});
