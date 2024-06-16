"use client";
import { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io();

const SharedScreen = () => {
  const [previousMsg, setPreviousMsg] = useState<string[]>([]);
  const [typingIndicator, setTypingIndicator] = useState<string | null>(null);

  useEffect(() => {
    socket.on("message", (msg: string) => {
      setPreviousMsg((prev) => [...prev, msg]);
    });

    socket.on("typing", (input: string) => {
      setTypingIndicator(input);
    });

    return () => {
      socket.off("message");
      socket.off("typing");
    };
  }, []);

  return (
    <div style={{color:"black", padding: "20px", backgroundColor: "#f4f4f4", minHeight: "100vh" }}>
      <div style={{ backgroundColor: "white", padding: "10px", marginBottom: "10px", borderRadius: "4px", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}>
        <h2>Message History</h2>
        {previousMsg.map((msg, index) => (
          <p key={index} style={{ margin: "5px 0" }}>{msg}</p>
        ))}
      </div>
      <div style={{ backgroundColor: "white", padding: "10px", borderRadius: "4px", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}>
        <h2>Currently Typing</h2>
        {typingIndicator && <p>{typingIndicator}</p>}
      </div>
    </div>
  );
};

export default SharedScreen;
