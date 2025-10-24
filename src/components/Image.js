import React, { useState } from "react";
import "./Image.css";

const Image = () => {
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState("");
    const [input, setInput] = useState("");

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { role: "user", content: input };
        setMessages(prev => [...prev, userMessage]);

        try {
            const response = await fetch(
                "https://chatbotwithimagebackend.onrender.com/Image",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ message: input })
                }
            );

            const data = await response.json();

            if (data.image_url) {
                setMessages(prev => [
                    ...prev,
                    { role: "bot", content: data.image_url }
                ]);
            } else {
                setError("Failed to generate image");
            }
        } catch (err) {
            setError("Error occurred while generating image");
            console.error(err);
        } finally {
            setInput("");
        }
    };

    return (
        <div className="ImageGenerator">
            <h1>Image Generator</h1>
            <div className="inputWrapper">
                <input
                    placeholder="Enter image prompt"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button onClick={sendMessage}>Generate Image</button>
            </div>

            {error && <p className="error">{error}</p>}

            <div className="GeneratedImage">
                {messages.map((msg, index) =>
                    msg.role === "bot" ? (
                        <img key={index} src={msg.content} alt="Generated" />
                    ) : null
                )}
            </div>
        </div>
    );
};

export default Image;

