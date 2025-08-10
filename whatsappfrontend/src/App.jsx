import React, { useState, useEffect } from "react";
import axios from "axios";

function ChatList({ chats, onSelectChat, selectedWaId }) {
  return (
    <div className="w-80 border-r border-gray-300 overflow-y-auto h-screen">
      {chats.map((chat) => (
        <div
          key={chat._id}
          onClick={() => onSelectChat(chat._id)}
          style={{
            cursor: "pointer",
            padding: "10px",
            borderBottom: "1px solid #ddd",
            backgroundColor: chat._id === selectedWaId ? "#ececec" : "white",
          }}
        >
          <div style={{ fontWeight: "bold", color: "#111" }}>
            {chat.name || chat._id}
          </div>
          <div
            style={{
              fontSize: "13px",
              color: "#666",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {chat.lastMessage}
          </div>
          <div style={{ fontSize: "10px", color: "#999", marginTop: 2 }}>
            {new Date(chat.lastTimestamp).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}

function ChatWindow({ waId }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!waId) return;
    setLoading(true);
    axios
      .get(/messages/${waId})
      .then((res) => {
        setMessages(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [waId]);

  if (!waId)
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#888",
          fontSize: 18,
          userSelect: "none",
        }}
      >
        Select a chat to start messaging
      </div>
    );

  if (loading)
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#888",
          fontSize: 18,
          userSelect: "none",
        }}
      >
        Loading messages...
      </div>
    );

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <div
        style={{
          flex: 1,
          padding: 15,
          overflowY: "auto",
          backgroundColor: "#f5f5f5",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {messages.map((msg) => {
          const isMe = msg.from === "me";
          return (
            <div
              key={msg.message_id}
              style={{
                maxWidth: "70%",
                padding: "10px 15px",
                borderRadius: 20,
                backgroundColor: isMe ? "#dcf8c6" : "white",
                alignSelf: isMe ? "flex-end" : "flex-start",
                boxShadow: "0 1px 1px rgba(0,0,0,0.1)",
                wordBreak: "break-word",
                fontSize: 14,
                position: "relative",
              }}
            >
              <div>{msg.text}</div>
              <div
                style={{
                  fontSize: 11,
                  color: "#555",
                  marginTop: 4,
                  textAlign: "right",
                  userSelect: "none",
                }}
              >
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                {msg.status === "sent" && "✓"}
                {msg.status === "delivered" && "✓✓"}
                {msg.status === "read" && (
                  <span style={{ color: "blue" }}>✓✓</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <SendMessageBox
        waId={waId}
        onNewMessage={(newMsg) => setMessages((prev) => [...prev, newMsg])}
      />
    </div>
  );
}

function SendMessageBox({ waId, onNewMessage }) {
  const [text, setText] = useState("");

  const sendMessage = async () => {
    if (!text.trim()) return;

    const newMessage = {
      wa_id: waId,
      from: "me",
      to: waId,
      text,
    };

    onNewMessage({
      message_id: temp_${Date.now()},
      wa_id: waId,
      from: "me",
      to: waId,
      timestamp: new Date(),
      text,
      status: "sent",
      name: "Me",
      meta_msg_id: temp_${Date.now()},
    });

    try {
      await axios.post("/messages/send", newMessage);
      setText("");
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  return (
    <div
      style={{
        padding: 10,
        borderTop: "1px solid #ccc",
        display: "flex",
        backgroundColor: "white",
      }}
    >
      <input
        type="text"
        placeholder="Type a message"
        style={{
          flex: 1,
          padding: "10px 15px",
          borderRadius: 20,
          border: "1px solid #ccc",
          fontSize: 16,
          outline: "none",
        }}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />
      <button
        onClick={sendMessage}
        style={{
          marginLeft: 10,
          padding: "10px 20px",
          borderRadius: 20,
          backgroundColor: "#0b81ff",
          color: "white",
          border: "none",
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: 16,
        }}
      >
        Send
      </button>
    </div>
  );
}

export default function App() {
  const [chats, setChats] = useState([]);
  const [selectedWaId, setSelectedWaId] = useState(null);

  useEffect(() => {
    axios
      .get("/chats")
      .then((res) => setChats(res.data))
      .catch((e) => console.error("Failed to fetch chats", e));
  }, []);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
      }}
    >
      <ChatList
        chats={chats}
        onSelectChat={setSelectedWaId}
        selectedWaId={selectedWaId}
      />
      <ChatWindow waId={selectedWaId} />
    </div>
  );
}