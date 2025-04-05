import React from 'react';

const MessageTable = ({ messages }) => {
  return (
    <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th>Phone Number</th>
          <th>Message</th>
          <th>Status</th>
          <th>DateTime</th>
        </tr>
      </thead>
      <tbody>
        {messages.map((msg) => (
          <tr key={msg._id}>
            <td>{msg.phone_number}</td>
            <td>{msg.message}</td>
            <td>{msg.status}</td>
            <td>{new Date(msg.datetime).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MessageTable;