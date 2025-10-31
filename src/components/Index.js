import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

const Index = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  // ✅ Read from environment variable
  const HF_ACCESS_TOKEN = process.env.HFACCESSTOKEN;

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await fetch("https://chatbotwithimagebackend.onrender.com/chat", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          Authorization: `Bearer ${HF_ACCESS_TOKEN}`, // ✅ injected from env
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      console.log("Response:", data);

      if (data.reply) {
        setMessages((prev) => [...prev, { role: "bot", content: data.reply }]);
      } else {
        console.error("API Error:", data);
      }
    } catch (error) {
      console.error("Request failed:", error);
    }

    setInput("");
  };

  return (
    <div className="landing-page">
      <header>
        <h1>Balai Chand</h1>
        <p>Chat with our AI assistant!</p>
      </header>

      <div className="chat-container">
        <div className="chat-box">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.role}`}>
              <strong>{msg.role === "user" ? "You" : "Bot"}:</strong> {msg.content}
            </div>
          ))}
        </div>

        <div className="input-container">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>

        <button className="Image Generator" onClick={() => navigate("/Image")}>
          Go To Image Generation Page
        </button>
      </div>
    </div>
  );
};

export default Index;





