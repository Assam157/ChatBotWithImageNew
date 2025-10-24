import React, { useState } from "react";
import "./Image.css";

const Image = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const BASE_URL = "https://chatbotwithimagebackend.onrender.com"; // your backend

  const sendMessage = async () => {
    if (!input.trim()) return;

    setMessages(prev => [...prev, { role: "user", content: input }]);

    try {
      // ===== IMAGE REQUEST =====
      const imgResp = await fetch(`${BASE_URL}/image`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const imgData = await imgResp.json();

      if (imgData.image_url) {
        setMessages(prev => [...prev, { role: "bot", content: imgData.image_url }]);
      } else {
        setError("Failed to generate image");
      }

      // ===== CHAT REQUEST =====
      const chatResp = await fetch(`${BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const chatData = await chatResp.json();

      if (chatData.reply) {
        setMessages(prev => [...prev, { role: "bot", content: chatData.reply }]);
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
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="GeneratedImage">
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.role === "user" ? "userMessage" : "botMessage"}>
            {msg.content.startsWith("http") && msg.role === "bot" ? (
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


