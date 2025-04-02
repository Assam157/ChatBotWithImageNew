import React, { useState } from "react";
import "./Image.css";

const Image = () => {
    const [message, setMessage] = useState([]);
    const [error, setError] = useState("");
    const [input, setInput] = useState("");
   
    const sendMessage = async () => {
        console.log(input);
        if (!input.trim()) return;

        const userMessage = { role: "user", content: input };
        setMessage(prev => [...prev, userMessage]);

        try {
            const response = await fetch("http://127.0.0.1:5000/Image", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: input })
            });

            const data = await response.json();
            if (data.image_url) {
                setMessage(prev => [...prev, { role: "bot", content: data.image_url }]);
            } else {
                setError("Failed to generate image");
            }
        } catch (error) {
            setError("Error occurred while generating image");
            console.error(error);
        }
    };

    return (
        <div className="ImageGenerator">
            <h1>Image Generator</h1>
            <input
                placeholder="Please enter the image you want to see"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onSubmit={(e)=>setInput(null)}
            />
            <button onClick={sendMessage}>Generate Image</button>
            {error && <p className="error">{error}</p>}
            <div className="GeneratedImage">
                {message.map((msg, index) =>
                    msg.role === "bot" ? (
                        <img key={index} src={msg.content} alt="Generated" />
                    ) : null
                )}
            </div>
        </div>
    );
};

export default Image;
