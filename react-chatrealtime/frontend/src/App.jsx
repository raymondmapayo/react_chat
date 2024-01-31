import React, { useState } from 'react';
import io from 'socket.io-client';
import Chats from './Chats';
import './css/App.css';


const socket = io.connect("http://localhost:3001");

const App = () => {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      console.log(`User with ID: ${socket.id} joined room: ${room}`);
      setShowChat(true);
    }
  };

  return (
    <div className='App'>
    {!showChat ? (
    <div className='joinChatContainer'>
      <h3>Join A Chat</h3>
      <input
        type='text'
        placeholder='@JohnDoe'
        onChange={(event) => {
          setUsername(event.target.value);
        }}
      />
      <input
        type='text'
        placeholder='@Code Id:'
        onChange={(event) => {
          setRoom(event.target.value);
        }}
      />
      <button onClick={joinRoom}>Join A Room</button>
</div>)
      :
      (
      <Chats socket={socket} username={username} room={room}/>
      )}
    </div>
  );
};

export default App;
