import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

const Image = () => {
  const [genMessage, setGenMessage] = useState("");
  const [modMessage, setModMessage] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [modifiedUrl, setModifiedUrl] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const BASE_URL = "http://127.0.0.1:5000";

  // === Generate image from text ===
  const generateImage = async () => {
    if (!genMessage.trim()) return alert("⚠️ Enter a message for generation!");
    setLoading(true);
    setImageUrl(null);

    try {
      const response = await fetch(`${BASE_URL}/image`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: genMessage }),
      });

      const data = await response.json();
      if (data.image_url) {
        setImageUrl(`${data.image_url}?t=${Date.now()}`);
      } else {
        alert("❌ Image generation failed.");
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ Server error generating image.");
    } finally {
      setLoading(false);
    }
  };

  // === Modify uploaded image ===
  const modifyImage = async () => {
    if (!file) return alert("⚠️ Upload an image first!");
    if (!modMessage.trim()) return alert("⚠️ Enter a message for modification!");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("message", modMessage);

    setLoading(true);
    setModifiedUrl(null);

    try {
      const response = await fetch(`${BASE_URL}/image_modify`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.modified_image_url) {
        setModifiedUrl(`${data.modified_image_url}?t=${Date.now()}`);
      } else {
        alert("❌ Image modification failed.");
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ Server error modifying image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="landing-page">
      <header>
        <h1>🧠 Image Generator</h1>
        <p>Generate or modify images independently using messages.</p>
      </header>

      <div className="chat-container">

        {/* === GENERATION SECTION === */}
        <div className="section">
          <h2>✨ Generate Image</h2>
          <input
            type="text"
            value={genMessage}
            onChange={(e) => setGenMessage(e.target.value)}
            placeholder="Enter message for image generation..."
          />
          <button type="button" onClick={generateImage} disabled={loading}>
            {loading ? "⏳ Generating..." : "🚀 Generate Image"}
          </button>

          {imageUrl && (
            <div className="image-box">
              <h3>Generated Image:</h3>
              <img src={imageUrl} alt="Generated" style={{ maxWidth: "80%" }} />
            </div>
          )}
        </div>

        {/* === MODIFICATION SECTION === */}
        <div className="section" style={{ marginTop: "40px" }}>
          <h2>🪄 Modify Uploaded Image</h2>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <input
            type="text"
            value={modMessage}
            onChange={(e) => setModMessage(e.target.value)}
            placeholder="Enter message for image modification..."
            style={{ marginTop: "10px" }}
          />
          <button type="button" onClick={modifyImage} disabled={loading}>
            {loading ? "⏳ Modifying..." : "🎨 Modify Image"}
          </button>

          {modifiedUrl && (
            <div className="image-box">
              <h3>Modified Image:</h3>
              <img
                src={modifiedUrl}
                alt="Modified"
                style={{ maxWidth: "80%" }}
              />
            </div>
          )}
        </div>

        {/* === Back Navigation === */}
        <button
          type="button"
          className="image-generator-btn"
          onClick={() => navigate("/")}
          style={{ marginTop: "30px" }}
        >
          ← Back to Chat
        </button>
      </div>
    </div>
  );
};

export default Image;








