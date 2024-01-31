import React, { useEffect, useState } from 'react';
import ScrollToBottom from "react-scroll-to-bottom"

const Chats = ({ socket, username, room }) => {
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    if (currentMessage !== '') {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time: new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes(),
      };
  
      await socket.emit('send_message', messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage(''); // Clear the input field after sending the message
    }
  };
  

  useEffect(() => {
    const handleReceiveMessage = (data) => {
      setMessageList((list) => [...list, data]);
    };
  
    socket.on('receive_message', handleReceiveMessage);
  
    // Cleanup previous event listener before setting up a new one
    return () => {
      socket.off('receive_message', handleReceiveMessage);
    };
  }, [socket]);
  

  return (
    <div className='chat-window'>
      <div className='chat-header'>
        <p>GAMCO Live Chat</p>
      </div>
      <div className='chat-body'>
      <ScrollToBottom className='message-container'>
  {messageList.map((messageContent, index) => (
    <div className='message' key={index} id={username === messageContent.author ? 'you' : 'other'}>
      <div>
        <div className='message-content'>
          <p>{messageContent.message}</p>
        </div>
        <div className='message-meta'>
          <p id='time'>{messageContent.time}</p>
          <p id='author'>{messageContent.author}</p>
        </div>
      </div>
    </div>
  ))}
  </ScrollToBottom>
</div>


<div className='chat-footer'>
  <input
    type='text'
    placeholder='Send message'
    value={currentMessage}
    onChange={(event) => {
      setCurrentMessage(event.target.value);
    }}
    onKeyPress={(event) => {
      event.key === 'Enter' && sendMessage();
    }}
  />
  <button onClick={sendMessage}>&#9658;</button>
</div>

    </div>
  );
};

export default Chats;
