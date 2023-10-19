import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client'

const HOST = 'ws://127.0.0.1:8000/';

function App() {
  const [imageUrl, setImageUrl] = useState('');

  const socket = io("ws://127.0.0.1:8000/", {
    path: "/ws/socket.io",
    autoConnect: false,
  });

  socket.on("message", (e) => {
    // console.log("Received  message", e)
    if (e.indexOf('connected') >= 0) {
      socket.emit('live_data', "please send data")
    }
    if (e.indexOf('data') >= 0) {

      const receivedJson = JSON.parse(e);
      if (receivedJson.type === 'base64') {
        console.log('data receive');
        const data = receivedJson.data;
        const imageUrl = 'data:image/jpeg;base64,' + data;
        setImageUrl(imageUrl);
      }
    }
  });
  socket.on("live_data", (e) => {
    console.log("Received", e)

  });
  socket.on('disconnect', () => {
    console.log('Disconnected');

  });
  const handleConnect = () => {
    console.log("Button Clicked to Connect");
    socket.connect();
  };

  const handleDisconnect = () => {
    console.log("Button Clicked to Disconnect");
    socket.close();
  };


  const disconnectSocket = () => {
    if (socket) {

      try {
        socket.off();
        console.log('close socket')
      } catch (error) {

      }
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <button onClick={handleConnect}>Connect</button>
        <button onClick={handleDisconnect}>Disconnect</button>
        <img src={imageUrl} width={600} height={400} />
        {/* <p>Data: {imageUrl}</p> */}
      </header>
    </div>
  );
}

export default App;
