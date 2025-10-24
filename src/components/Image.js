import React, { useState } from "react";
import "./Image.css";

const Image = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  // Your deployed backend
  const BASE_URL = "https://chatbotwithimagebackend.onrender.com";

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: input }]);

    try {
      // ===== IMAGE REQUEST =====
      const imgResponse = await fetch(`${BASE_URL}/image`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const imgData = await imgResponse.json();

      if (imgData.image_base64) {
        // Prepend data URI prefix for base64
        const imgSrc = `data:image/png;base64,${imgData.image_base64}`;
        setMessages((prev) => [...prev, { role: "bot", content: imgSrc }]);
      } else {
        setError("Failed to generate image");
      }

      // ===== CHAT REQUEST =====
      const chatResponse = await fetch(`${BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const chatData = await chatResponse.json();

      if (chatData.reply) {
        setMessages((prev) => [...prev, { role: "bot", content: chatData.reply }]);
      }
    } catch (err) {
      setError("Error connecting to backend");
      console.error(err);
    } finally {
      setInput("");
    }
  };

  return (
    <div className="ImageGenerator">
      <h1>Image & Chat Bot</h1>

      <div className="inputWrapper">
        <input
          type="text"
          placeholder="Enter your prompt"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="GeneratedImage">
        {messages.map((msg, index) => (
          <div key={index} className={msg.role === "user" ? "userMessage" : "botMessage"}>
            {msg.role === "bot" && msg.content.startsWith("data:image") ? (
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
