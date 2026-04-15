import React, { useState } from "react";
import axios from "axios";
import VoiceInput from "./VoiceInput";

const ChatBox = () => {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = async (inputText) => {
    const userMsg = { sender: "user", text: inputText };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await axios.post(
        "http://localhost:5173/api/ai/process",
        { text: inputText },
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZGYyYWMyYTNmZTQ0MTIwNmViNjhlNSIsImlhdCI6MTc3NjI0ODQ4NiwiZXhwIjoxNzc4ODQwNDg2fQ.kHs_M6Hf6W1VMnmfhWNig88v0Hxa3So7IR9dcgzJ2M8`,
          },
        },
      );

      const botMsg = {
        sender: "bot",
        text: res.data.message,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text) return;
    sendMessage(text);
    setText("");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>💰 AI Finance Assistant</h2>

      {/* Chat messages */}
      <div style={{ minHeight: "300px", marginBottom: "10px" }}>
        {messages.map((msg, i) => (
          <div key={i}>
            <b>{msg.sender}:</b> {msg.text}
          </div>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type here..."
        />
        <button type="submit">Send</button>
      </form>

      {/* Voice */}
      <VoiceInput onResult={sendMessage} />
    </div>
  );
};

export default ChatBox;
