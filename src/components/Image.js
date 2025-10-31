import React, { useState } from "react";
import "./Image.css";

const Image = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [modPrompt, setModPrompt] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  // ===== Backend URL =====
  const BASE_URL = "https://chatbotwithimagebackend.onrender.com"; // Flask backend

  // ===============================
  // IMAGE GENERATION + CHAT
  // ===============================
  const sendMessage = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setError("");

    try {
      // ===== IMAGE GENERATION =====
      const imgResp = await fetch(`${BASE_URL}/image`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const imgData = await imgResp.json();

      if (imgData.image_url) {
        setMessages((prev) => [
          ...prev,
          { role: "bot", content: imgData.image_url },
        ]);
      } else {
        setError("Failed to generate image");
        console.error("Image generation error:", imgData);
      }

      // ===== CHAT RESPONSE =====
      const chatResp = await fetch(`${BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const chatData = await chatResp.json();

      if (chatData.reply) {
        setMessages((prev) => [
          ...prev,
          { role: "bot", content: chatData.reply },
        ]);
      }
    } catch (err) {
      setError("Error connecting to backend");
      console.error(err);
    } finally {
      setInput("");
    }
  };

  // ===============================
  // IMAGE MODIFICATION
  // ===============================
   const modifyImage = async () => {
  if (!file) return setError("Please upload an image first");
  if (!modPrompt.trim()) return setError("Please enter a modification prompt");

  setError("");
  setMessages((prev) => [
    ...prev,
    { role: "user", content: `Modify image: ${modPrompt}` },
  ]);

  try {
    const formData = new FormData();
    formData.append("file", file); // must match Flask backend key
    formData.append("prompt", modPrompt);

    const resp = await fetch(`${BASE_URL}/image_modify`, {
      method: "POST",
      body: formData,
    });

    const data = await resp.json();

    // ✅ FIX: Check for modified_image_url
    if (data.modified_image_url) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: data.modified_image_url },
      ]);
    } else {
      setError("Image modification failed");
      console.error("Response:", data);
    }
  } catch (err) {
    console.error(err);
    setError("Error modifying image");
  } finally {
    setFile(null);
    setModPrompt("");
  }
};

  return (
    <div className="ImageGenerator">
      <h1>🖼️ Image + Chat Bot</h1>

      {/* ===== NORMAL IMAGE GENERATION ===== */}
      <div className="inputWrapper">
        <input
          type="text"
          placeholder="Enter your prompt (e.g., a cat on the moon)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>

      {/* ===== IMAGE MODIFICATION SECTION ===== */}
      <div className="modifyWrapper">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <input
          type="text"
          placeholder="Enter modification prompt (e.g., add sunset)"
          value={modPrompt}
          onChange={(e) => setModPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && modifyImage()}
        />
        <button onClick={modifyImage}>Modify Image</button>
      </div>

      {error && <p className="error">{error}</p>}

      {/* ===== DISPLAY MESSAGES ===== */}
      <div className="GeneratedImage">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={msg.role === "user" ? "userMessage" : "botMessage"}
          >
            {msg.content.startsWith("data:image") ||
            msg.content.startsWith("http") ? (
              <img src={msg.content} alt="Generated" />
            ) : (
              <p>{msg.content}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Image;





