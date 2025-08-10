import React, { useState, useEffect } from "react";
import axios from "axios";

const BACKEND_URL = "http://localhost:8081/api/messages";
const MY_NUMBER = "918329446654"; // must match backend MY_NUMBER

function ChatList({ chats, onSelectChat, selectedWaId }) {
  return (
    <div style={{
      width: 280,
      borderRight: "1px solid #ddd",
      overflowY: "auto",
      height: "100vh",
      backgroundColor: "#fafafa"
    }}>
      <h2 style={{ textAlign: "center", padding: 10, borderBottom: "1px solid #ddd" }}>
        Chats
      </h2>
      {chats.map((chat) => (
        <div
          key={chat._id}
          onClick={() => onSelectChat(chat._id)}
          style={{
            cursor: "pointer",
            padding: "12px 15px",
            borderBottom: "1px solid #eee",
            backgroundColor: chat._id === selectedWaId ? "#d0e6ff" : "transparent"
          }}
        >
          <div style={{ fontWeight: "bold", color: "#222" }}>
            {chat.name}
          </div>
          <div style={{
            fontSize: 13,
            color: "#555",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            marginTop: 4,
          }}>
            {chat.lastMessage}
          </div>
          <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>
            {new Date(chat.lastTimestamp).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}

function StatusBadge({ status }) {
  const colors = {
    sent: "#2196F3",
    delivered: "#4CAF50",
    read: "#9C27B0",
    pending: "#FF9800",
  };
  const color = colors[status] || "#777";
  return (
    <span style={{
      backgroundColor: color,
      color: "white",
      padding: "2px 6px",
      borderRadius: 12,
      fontSize: 11,
      marginLeft: 8,
    }} title={status}>
      {status}
    </span>
  );
}

function ChatWindow({ waId }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");

  // Load messages for selected chat
  useEffect(() => {
    if (!waId) return;
    setLoading(true);
    axios.get(`${BACKEND_URL}/user/${waId}`)
      .then(res => {
        setMessages(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [waId]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMsg = {
      id: `temp-${Date.now()}`,
      from: MY_NUMBER,
      to: waId,
      text: input,
      timestamp: new Date().toISOString(),
      status: "sent",
    };

    setMessages(prev => [...prev, newMsg]);
    setInput("");

    try {
      await axios.post(BACKEND_URL, newMsg);
      // Reload messages to sync status from backend
      const res = await axios.get(`${BACKEND_URL}/user/${waId}`);
      setMessages(res.data);
    } catch (err) {
      alert("Failed to send message");
    }
  };

  if (!waId)
    return <div style={{
      flex: 1,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: "#aaa",
      fontSize: 20,
      userSelect: "none"
    }}>Select a chat to start messaging</div>;

  if (loading)
    return <div style={{
      flex: 1,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: "#aaa",
      fontSize: 20,
      userSelect: "none"
    }}>Loading messages...</div>;

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh" }}>
      <div style={{
        flex: 1,
        padding: 15,
        overflowY: "auto",
        backgroundColor: "#e5ddd5",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}>
        {messages.map(msg => {
          const isMe = msg.from === MY_NUMBER;
          return (
            <div key={msg.message_id} style={{
              maxWidth: "65%",
              padding: 12,
              borderRadius: 20,
              backgroundColor: isMe ? "#dcf8c6" : "white",
              alignSelf: isMe ? "flex-end" : "flex-start",
              boxShadow: "0 1px 1px rgba(0,0,0,0.1)",
              wordBreak: "break-word",
              fontSize: 15,
              position: "relative",
            }}>
              <div>{msg.text}</div>
              <div style={{
                fontSize: 11,
                color: "#555",
                marginTop: 6,
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: 4,
              }}>
                <small>{new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit"
                })}</small>
                <StatusBadge status={msg.status} />
              </div>
            </div>
          );
        })}
      </div>
      <div style={{
        padding: 12,
        borderTop: "1px solid #ccc",
        backgroundColor: "white",
        display: "flex",
        gap: 8,
      }}>
        <input
          type="text"
          placeholder="Type a message"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          style={{
            flex: 1,
            padding: 12,
            fontSize: 16,
            borderRadius: 20,
            border: "1px solid #ccc",
            outline: "none"
          }}
        />
        <button onClick={sendMessage} style={{
          backgroundColor: "#0b81ff",
          color: "white",
          border: "none",
          borderRadius: 20,
          padding: "10px 20px",
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: 16,
        }}>
          Send
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [chats, setChats] = useState([]);
  const [selectedWaId, setSelectedWaId] = useState(null);

  // Load chat list
  useEffect(() => {
    axios.get(`${BACKEND_URL}/chats`)
      .then(res => {
        setChats(res.data);
        if (res.data.length > 0) setSelectedWaId(res.data[0]._id);
      })
      .catch(e => console.error("Failed to load chats", e));
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Arial, sans-serif" }}>
      <ChatList
        chats={chats}
        selectedWaId={selectedWaId}
        onSelectChat={setSelectedWaId}
      />
      <ChatWindow waId={selectedWaId} />
    </div>
  );
}



