import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';

export default function App(){
  const [selectedWa, setSelectedWa] = useState(null);
  return (
    <div className="app h-screen flex">
      <aside className="w-80 bg-white border-r">
        <div className="p-4 font-bold text-lg border-b">WA Clone-L</div>
        <Sidebar onSelectChat={setSelectedWa} selected={selectedWa}/>
      </aside>

      <main className="flex-1">
        {selectedWa ? (
          <ChatWindow wa_id={selectedWa} onClose={() => setSelectedWa(null)} />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Select a chat to view messages
          </div>
        )}
      </main>
    </div>
  );
}
