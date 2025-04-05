import React, { useState, useEffect } from 'react';
import FileUpload from '../components/FileUpload';
import MessageTable from '../components/MessageTable';
import { fetchMessages } from '../api';

const Home = () => {
  const [messages, setMessages] = useState([]);

  const loadMessages = async () => {
    try {
      const res = await fetchMessages();
      setMessages(res.data);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>SMS Management Dashboard</h1>
      <FileUpload onUpload={loadMessages} />
      <h2>Messages</h2>
      <MessageTable messages={messages} />
    </div>
  );
};

export default Home;