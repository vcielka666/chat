"use client";
import { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io();

const Chat = () => {
  const [trollBoxInput, setTrollBoxInput] = useState<string>("");
  const [previousMsg, setPreviousMsg] = useState<string[]>([]);
  const [typingIndicator, setTypingIndicator] = useState<string | null>(null);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected");
    });

    socket.on("message", (msg: string) => {
      setPreviousMsg((prev) => [...prev, msg]);
    });

    socket.on("typing", (input: string) => {
      setTypingIndicator(input);
    });

    socket.on("disconnect", () => {
      console.log("disconnected");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    setTrollBoxInput(input);
    socket.emit("typing", input);
  };

  const handleSendMessage = () => {
    socket.emit("message", trollBoxInput);
    setPreviousMsg((prev) => [...prev, trollBoxInput]);
    setTrollBoxInput("");
    setTypingIndicator(null);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div style={{color:"black", padding: "20px", backgroundColor: "#f4f4f4", minHeight: "25vh" }}>
      <div style={{ backgroundColor: "white", padding: "10px", marginBottom: "10px", borderRadius: "4px", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}>
        {previousMsg.map((msg, index) => (
          <p key={index} style={{ margin: "5px 0" }}>{msg}</p>
        ))}
      </div>
      <input
        type="text"
        value={trollBoxInput}
        onChange={handleInputChange}
        onKeyDown={handleKeyPress}
        style={{ width: "80%", padding: "10px", marginRight: "10px", border: "1px solid" }}
      />
      <button onClick={handleSendMessage} style={{ padding: "10px" }}>Send Message</button>
    </div>
  );
};

export default Chat;
