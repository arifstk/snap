// components/DeliveryChat.tsx

'use client';
import axios from 'axios';
import { getSocket } from '@/lib/socket';
import { Send } from 'lucide-react';
import mongoose from 'mongoose';
import React, { useEffect, useRef, useState } from 'react';

// CHANGELOG: added `| string | null` to senderId — API returns populated object or null
type Message = {
  roomId: mongoose.Types.ObjectId;
  text: string;
  senderId: mongoose.Types.ObjectId | string | null;
  time: string;
};

type PersonInfo = {
  name: string;
  image?: string | null;
};

type Props = {
  orderId: mongoose.Types.ObjectId;
  deliveryBoyId: mongoose.Types.ObjectId;
};

const Avatar = ({ name, image, size = 'md' }: { name: string; image?: string | null; size?: 'sm' | 'md' }) => {
  const dimension = size === 'sm' ? 28 : 40;
  const sizeClass = size === 'sm' ? 'w-7 h-7 text-[10px]' : 'w-10 h-10 text-sm';
  const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className={`${sizeClass} rounded-full overflow-hidden shrink-0 bg-[#25D366] flex items-center justify-center relative`}>
      {image ? (
        <img src={image} alt={name} width={dimension} height={dimension} className='object-cover w-full h-full' />
      ) : (
        <span className='text-white font-bold'>{initials}</span>
      )}
    </div>
  );
};

// CHANGELOG: helper to normalize senderId from populated object { _id, name } or plain id or null
const normalizeSenderId = (senderId: any): string | null => {
  if (senderId == null) return null;
  if (typeof senderId === 'object' && senderId._id) return senderId._id.toString();
  return senderId.toString();
};

const DeliveryChat = ({ orderId, deliveryBoyId }: Props) => {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [customer, setCustomer] = useState<PersonInfo>({ name: 'Customer' });
  const [deliveryBoy, setDeliveryBoy] = useState<PersonInfo>({ name: 'Me' });
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchRoomInfo = async () => {
      try {
        const res = await axios.get(`/api/chat/room-info?roomId=${orderId}`);
        setCustomer(res.data.customer);
        setDeliveryBoy(res.data.deliveryBoy);
      } catch (err) {
        console.error("Failed to load room info:", err);
      }
    };
    fetchRoomInfo();
  }, [orderId]);

  useEffect(() => {
    const socket = getSocket();
    socket.emit("join-room", orderId.toString());

    const fetchMessages = async () => {
      try {
        const res = await axios.get(`/api/chat/messages?roomId=${orderId}`);
        // CHANGELOG: normalize senderId on each message from API
        // API may return senderId as populated object { _id, name } — unwrap to plain string
        const normalized = res.data.map((msg: any) => ({
          ...msg,
          senderId: normalizeSenderId(msg.senderId),
        }));
        setMessages(normalized);
      } catch (err) {
        console.error("Failed to load messages:", err);
      }
    };
    fetchMessages();

    // CHANGELOG: normalize incoming socket messages too — socket may send raw ObjectId or object
    const handleIncoming = (message: any) => {
      setMessages(prev => [...prev, {
        ...message,
        senderId: normalizeSenderId(message.senderId),
      }]);
    };

    // CHANGELOG: replaced anonymous inline handler with named handleIncoming
    // so the exact same reference is removed on cleanup — prevents duplicate messages
    socket.on("send-message", handleIncoming);
    return () => { socket.off("send-message", handleIncoming); };
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
      // CHANGELOG: store deliveryBoyId as plain string to match normalized senderIds
      senderId: deliveryBoyId.toString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    socket.emit("send-message", message);
    setNewMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') sendMsg();
  };

  return (
    <div className='flex flex-col h-120 rounded-2xl overflow-hidden shadow-xl border border-gray-200'>

      {/* Header — shows customer avatar + name */}
      <div className='flex items-center gap-3 px-4 py-3 bg-[#075E54]'>
        <Avatar name={customer.name} image={customer.image} />
        <div>
          <p className='text-white font-semibold text-sm'>{customer.name}</p>
          <p className='text-green-200 text-xs'>Online</p>
        </div>
      </div>

      {/* Messages */}
      <div
        className='flex-1 overflow-y-auto px-4 py-3 space-y-2
          [&::-webkit-scrollbar]:w-1
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:rounded-full
          hover:[&::-webkit-scrollbar-thumb]:bg-gray-400'
        style={{ backgroundColor: '#ECE5DD' }}
      >
        {messages.length === 0 && (
          <div className='flex justify-center mt-8'>
            <span className='bg-white/70 text-gray-500 text-xs px-4 py-1.5 rounded-full shadow-sm'>
              No messages yet
            </span>
          </div>
        )}

        {messages.map((msg, i) => {
          // CHANGELOG: null-safe isMe check — senderId may be null after normalization
          const isMe = msg.senderId != null && msg.senderId.toString() === deliveryBoyId.toString();
          // isMe=true → delivery boy sent it → show on RIGHT with deliveryBoy avatar
          // isMe=false → customer sent it → show on LEFT with customer avatar
          const senderInfo = isMe ? deliveryBoy : customer;

          return (
            <div key={i} className={`flex items-end gap-1.5 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
              <Avatar name={senderInfo.name} image={senderInfo.image} size='sm' />
              <div
                className={`max-w-[70%] px-3 pt-2 pb-1 rounded-2xl shadow-sm text-sm
                  ${isMe
                    ? 'bg-[#DCF8C6] text-gray-800 rounded-br-none'
                    : 'bg-white text-gray-800 rounded-bl-none'
                  }`}
              >
                <p className='leading-snug'>{msg.text}</p>
                <p className='text-[10px] text-gray-400 text-right mt-0.5'>{msg.time}</p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className='flex items-center gap-2 px-3 py-2 bg-[#F0F0F0] border-t'>
        <input
          className='flex-1 bg-white px-4 py-2 rounded-full text-sm outline-none shadow-sm focus:ring-1 focus:ring-[#075E54]'
          type='text'
          placeholder='Type a message'
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className='w-10 h-10 flex items-center justify-center bg-[#075E54] hover:bg-[#064e46] rounded-full text-white disabled:opacity-40 transition disabled:cursor-not-allowed cursor-pointer'
          onClick={sendMsg}
          disabled={!newMessage.trim()}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};

export default DeliveryChat;