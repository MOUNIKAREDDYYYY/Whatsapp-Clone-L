import React, { useEffect, useRef, useState } from 'react';
import API from '../utils/api';
import socket from '../services/socket';
import MessageBubble from './MessageBubble';

const BUSINESS_NUMBER = import.meta.env.VITE_BUSINESS_NUMBER || 'BUSINESS_NUMBER';

export default function ChatWindow({ wa_id, onClose }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const scroller = useRef();

  async function load() {
    try {
      const res = await API.get('/messages'); // all messages
      const list = res.data.filter(m => m.from === wa_id || m.to === wa_id);
      list.sort((a,b)=> new Date(a.timestamp) - new Date(b.timestamp));
      setMessages(list);
    } catch (e){ console.error(e); }
  }

  useEffect(()=> {
    load();
    const onNew = (m) => {
      // reload if relevant
      if (m.from === wa_id || m.to === wa_id) load();
    };
    socket.on('new_message', onNew);
    socket.on('status_update', load);
    return ()=> {
      socket.off('new_message', onNew);
      socket.off('status_update', load);
    };
  }, [wa_id]);

  useEffect(()=> scroller.current?.scrollIntoView({ behavior: 'smooth' }), [messages]);

  async function sendMessage(e){
    e?.preventDefault();
    if (!text.trim()) return;
    const payload = {
      id: `local-${Date.now()}`,
      meta_msg_id: null,
      from: BUSINESS_NUMBER,
      to: wa_id,
      text,
      timestamp: new Date().toISOString(),
      status: 'sent'
    };
    try{
      await API.post('/messages', payload); // POST /api/messages
      setText('');
      load();
    }catch(err){ console.error(err); }
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="chat-header flex items-center justify-between">
        <div className="flex items-center gap-3 p-3">
          <button className="md:hidden mr-2" onClick={onClose}>Back</button>
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">{wa_id[0]}</div>
          <div>
            <div className="font-medium">{wa_id}</div>
            <div className="text-xs text-gray-500">WhatsApp contact</div>
          </div>
        </div>
      </div>

      <div className="chat-body">
        {messages.map(m => <MessageBubble key={m.id || m._id} message={m} businessNumber={BUSINESS_NUMBER} />)}
        <div ref={scroller} />
      </div>

      <form className="composer" onSubmit={sendMessage}>
        <input value={text} onChange={e=>setText(e.target.value)} placeholder="Type a message" />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
