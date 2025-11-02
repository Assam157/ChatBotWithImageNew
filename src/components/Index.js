import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

const Index = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🌐 Use your deployed Render backend
  const BASE_URL = "https://chatbotwithimagebackend.onrender.com";

  const sendMessage = async () => {
    if (!input.trim()) {
      alert("⚠️ Please enter a message first!");
      return;
    }

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      console.log("💬 Response from Flask:", data);

      if (data.reply) {
        setMessages((prev) => [...prev, { role: "bot", content: data.reply }]);
      } else if (data.error) {
        setMessages((prev) => [
          ...prev,
          { role: "bot", content: `⚠️ Error: ${data.error}` },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "bot", content: "⚠️ No valid reply from backend." },
        ]);
      }
    } catch (error) {
      console.error("Request failed:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content:
            "❌ Server not reachable. Please check the deployed backend on Render.",
        },
      ]);
    } finally {
      setInput("");
      setLoading(false);
    }
  };

  return (
    <div className="landing-page">
      <header>
        <h1>🧠 Balai Chand</h1>
        <p>Chat with your AI assistant hosted on Render</p>
      </header>

      <div className="chat-container">
        <div className="chat-box">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.role}`}>
              <strong>{msg.role === "user" ? "You" : "Bot"}:</strong>{" "}
              {msg.content}
            </div>
          ))}
        </div>

        <div className="input-container">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage} disabled={loading}>
            {loading ? "Sending..." : "Send"}
          </button>
        </div>

        <button
          className="image-generator-btn"
          onClick={() => navigate("/image")}
        >
          🖼️ Go to Image Generation
        </button>
      </div>
    </div>
  );
};

export default Index;
