import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

const Index = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await fetch("https://chatbotwithimagebackend.onrender.com/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      console.log("Response:", data);

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
          { role: "bot", content: "⚠️ No response from AI." },
        ]);
      }
    } catch (error) {
      console.error("Request failed:", error);
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "⚠️ Server error. Please try again." },
      ]);
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
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage}>Send</button>
        </div>

        <button className="Image Generator" onClick={() => navigate("/image")}>
          Go To Image Generation Page
        </button>
      </div>
    </div>
  );
};

export default Index;


