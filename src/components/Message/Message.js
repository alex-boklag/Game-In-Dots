import React from 'react';
import './Message.css';

const Message = ({ text }) => {
  return (
    <section className="message">
      <p>{text}</p>
    </section>
  );
}

export default Message;