import React, { useState } from "react";
import "./App.css";

const BACKEND_URL = "http://localhost:5000"; // ✅ Change this if deployed

export default function App() {
  const [message, setMessage] = useState("");
  const [chatReply, setChatReply] = useState("");
  const [imageBase64, setImageBase64] = useState(null);
  const [modImageBase64, setModImageBase64] = useState(null);
  const [instruction, setInstruction] = useState("");
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("chat");

  // ============== 🔹 CHAT ====================
  const handleChat = async () => {
    if (!message) return alert("Enter a message first!");
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      setChatReply(data.reply || data.error || "No reply");
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // ============== 🖼️ IMAGE GENERATION ====================
  const handleImageGen = async () => {
    if (!message) return alert("Enter a prompt!");
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/generate_image`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      if (data.image_base64)
        setImageBase64(`data:image/png;base64,${data.image_base64}`);
      else alert(data.error || "Failed to generate image");
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // ============== 🧠 IMAGE MODIFICATION ====================
  const handleModify = async () => {
    if (!imageBase64) return alert("Generate or upload an image first!");
    if (!instruction) return alert("Enter modification instruction!");
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/modify_image`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image_base64: imageBase64.split(",")[1],
          instruction,
        }),
      });
      const data = await res.json();
      if (data.modified_image_base64)
        setModImageBase64(`data:image/png;base64,${data.modified_image_base64}`);
      else alert(data.error || "Modification failed");
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <h1>🧠 Flask + HuggingFace AI Playground</h1>

      {/* ============== Navigation Tabs ============== */}
      <div className="tab-buttons">
        <button
          className={tab === "chat" ? "active" : ""}
          onClick={() => setTab("chat")}
        >
          💬 Chat
        </button>
        <button
          className={tab === "gen" ? "active" : ""}
          onClick={() => setTab("gen")}
        >
          🎨 Generate Image
        </button>
        <button
          className={tab === "mod" ? "active" : ""}
          onClick={() => setTab("mod")}
        >
          🧠 Modify Image
        </button>
      </div>

      {/* ============== Chat Tab ============== */}
      {tab === "chat" && (
        <div className="chat-tab">
          <textarea
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={handleChat} disabled={loading}>
            {loading ? "Thinking..." : "Send"}
          </button>
          {chatReply && (
            <div className="reply-box">
              <strong>AI:</strong> {chatReply}
            </div>
          )}
        </div>
      )}

      {/* ============== Image Generation Tab ============== */}
      {tab === "gen" && (
        <div className="img-tab">
          <textarea
            placeholder="Describe the image you want..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={handleImageGen} disabled={loading}>
            {loading ? "Generating..." : "Generate Image"}
          </button>
          {imageBase64 && (
            <img
              src={imageBase64}
              alt="Generated"
              className="preview"
              style={{ marginTop: "10px" }}
            />
          )}
        </div>
      )}

      {/* ============== Image Modification Tab ============== */}
      {tab === "mod" && (
        <div className="mod-tab">
          <p>Modify generated image below ⬇️</p>
          {imageBase64 && (
            <img src={imageBase64} alt="To modify" className="preview" />
          )}
          <textarea
            placeholder="Enter modification instruction (e.g. add blue sky)"
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
          />
          <button onClick={handleModify} disabled={loading}>
            {loading ? "Editing..." : "Modify Image"}
          </button>
          {modImageBase64 && (
            <img
              src={modImageBase64}
              alt="Modified"
              className="preview"
              style={{ marginTop: "10px" }}
            />
          )}
        </div>
      )}
    </div>
  );
}
