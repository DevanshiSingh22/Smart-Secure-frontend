import React, { useState, useRef, useEffect } from "react";
import axios from "axios";



const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load chat history from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("chatHistory");
    if (stored && JSON.parse(stored).length > 0) {
      setMessages(JSON.parse(stored));
    } else {
      setMessages([{ from: "bot", text: "Hi, I'm NOVA. How can I help you today?" }]);
    }
  }, []);


  // Save chat history
  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(messages));
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { from: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(`${backendURL}/api/chatbot`, { query: input });
      const botMessage = { from: "bot", text: res.data.answer };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("AI error:", err);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Oops, something went wrong. Try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating AI Icon/Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="ai-icon"
      >
        <img src="/robot.png" alt="Nova AI" />
      </button>

      {isOpen && (
        <div className="chat-window">
          <div className="chat-header flex items-center justify-between">
            <span className="flex items-center gap-2">
              Got questions? I’ve got answers!
              <img
                src="/robot2.png"
                alt="Nova AI"
                className="robot-icon"
                
              />
            </span>

            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              ✖
            </button>
          </div>

          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-message ${msg.from === 'user' ? 'user' : 'ai'}`}>
                {msg.text}
              </div>
            ))}
            {loading && <p className="chat-message ai" style={{ fontStyle: 'italic' }}>NOVA is thinking...</p>}
            <div ref={messagesEndRef} />
          </div>
          <div className="chat-input">
            <input
              placeholder="Ask something..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}


    </>
  );
}

export default AiAssistant;
