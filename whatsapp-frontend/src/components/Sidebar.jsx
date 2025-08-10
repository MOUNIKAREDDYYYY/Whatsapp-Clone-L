import React, { useEffect, useState } from 'react';
import API from '../utils/api';
import socket from '../services/socket';

export default function Sidebar({ onSelectChat, selected }) {
  const [conversations, setConversations] = useState([]);

  async function load() {
    try {
      const res = await API.get('/messages'); // GET /api/messages
      const msgs = res.data;
      const grouped = {};
      msgs.forEach(m => {
        const wa = m.from;
        if (!grouped[wa]) grouped[wa] = [];
        grouped[wa].push(m);
      });
      const list = Object.entries(grouped).map(([wa, arr]) => {
        arr.sort((a,b)=>new Date(a.timestamp)-new Date(b.timestamp));
        const last = arr[arr.length-1];
        return { wa, lastText: last?.text, lastTimestamp: last?.timestamp, contact_name: last?.from };
      }).sort((a,b)=> new Date(b.lastTimestamp) - new Date(a.lastTimestamp));
      setConversations(list);
    } catch (e){ console.error(e); }
  }

  useEffect(()=> {
    load();
    socket.on('new_message', load);
    socket.on('status_update', load);
    return ()=> {
      socket.off('new_message', load);
      socket.off('status_update', load);
    };
  }, []);

  return (
    <div className="chat-list">
      {conversations.map(c=>(
        <div key={c.wa} className={`chat-item ${selected===c.wa?'bg-gray-100':''}`} onClick={()=> onSelectChat(c.wa)}>
          <div className="avatar">{c.contact_name ? c.contact_name[0] : c.wa[0]}</div>
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate">{c.contact_name || c.wa}</div>
            <div className="text-sm text-gray-500 truncate">{c.lastText}</div>
          </div>
          <div className="text-xs text-gray-400 ml-2">{c.lastTimestamp ? new Date(c.lastTimestamp).toLocaleTimeString():''}</div>
        </div>
      ))}
    </div>
  );
}
