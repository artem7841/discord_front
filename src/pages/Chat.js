import React, { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let stompClient = null;

export default function Chat() {
  const [username, setUsername] = useState("");
  const [connected, setConnected] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const connect = () => {
    const socket = new SockJS("http://localhost:8090/ws");
    setUsername(localStorage.getItem("username"))

    stompClient = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        setConnected(true);

        stompClient.subscribe("/topic/public", (payload) => {
          const msg = JSON.parse(payload.body);
          setMessages((prev) => [...prev, msg]);
        });

        stompClient.publish({
          destination: "/app/chat.addUser",
          body: JSON.stringify({ sender: username, type: "JOIN" }),
        });
      },
    });

    stompClient.activate();
  };

  const sendMessage = () => {
    if (stompClient && message.trim() !== "") {
      stompClient.publish({
        destination: "/app/chat.sendMessage",
        body: JSON.stringify({
          sender: username,
          content: message,
          type: "CHAT",
        }),
      });
      setMessage("");
    }
  };

  return (
  <div className="chat-container">
    {!connected ? (
      <div className="chat-form">
        <h1>Нет подключения</h1>
      </div>
    ) : (
      <div className="chat-room">
        <div className="chat-messages">
          {messages.map((msg, i) => (
            <div key={i} className="chat-message">
              <b>{msg.sender}:</b> {msg.content}
            </div>
          ))}
        </div>
        <div className="chat-send">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Сообщение..."
            className="chat-input"
          />
          <button className="chat-btn" onClick={sendMessage}>
            Отправить
          </button>
        </div>
      </div>
    )}
  </div>
);

}
