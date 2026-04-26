// components/DeliveryChat.tsx
'use client';
import axios from 'axios';
import { getSocket } from '@/lib/socket';
import { Send } from 'lucide-react';
import mongoose from 'mongoose';
import React, { useEffect, useRef, useState } from 'react';

type Message = {
  roomId: mongoose.Types.ObjectId;
  text: string;
  senderId: mongoose.Types.ObjectId;
  time: string;
};

type Props = {
  orderId: mongoose.Types.ObjectId;
  deliveryBoyId: mongoose.Types.ObjectId;
};

const DeliveryChat = ({ orderId, deliveryBoyId }: Props) => {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const socket = getSocket();
    socket.emit("join-room", orderId.toString());

    const fetchMessages = async () => {
      try {
        const res = await axios.get(`/api/chat/messages?roomId=${orderId}`);
        setMessages(res.data);
      } catch (err) {
        console.error("Failed to load messages:", err);
      }
    };
    fetchMessages();

    socket.on("send-message", (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    return () => { socket.off("send-message"); };
  }, [orderId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMsg = () => {
    if (!newMessage.trim()) return;

    const socket = getSocket();
    const message: Message = {
      roomId: orderId,
      text: newMessage,
      senderId: deliveryBoyId,
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    socket.emit("send-message", message);
    // setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') sendMsg();
  };

  return (
    <div className='bg-white rounded-3xl shadow-lg p-4 h-105 flex flex-col'>
      <h2 className='font-semibold text-gray-700 mb-2'>Live Chat</h2>

      <div className='flex-1 overflow-y-auto space-y-2 pr-1'>
        {messages.length === 0 && (
          <p className='text-center text-gray-400 text-sm mt-8'>No messages yet</p>
        )}
        {messages.map((msg, i) => {
          const isMe = msg.senderId.toString() === deliveryBoyId.toString();
          return (
            <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${isMe ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                <p>{msg.text}</p>
                <p className={`text-xs mt-1 ${isMe ? 'text-green-200' : 'text-gray-400'}`}>
                  {msg.time}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className='flex gap-2 mt-3 border-t pt-3'>
        <input
          className='flex-1 bg-gray-100 px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-green-500'
          type='text'
          placeholder='Type a message...'
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className='bg-green-600 hover:bg-green-700 p-3 rounded-xl text-white cursor-pointer disabled:opacity-40'
          onClick={sendMsg}
          disabled={!newMessage.trim()}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default DeliveryChat;