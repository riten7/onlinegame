import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import ParticlesBg from "particles-bg";
import PlayerLogin from './components/PlayerLogin';
import Players from './components/Players';
import PlayGame from './components/PlayGame';
import { Container } from 'react-bootstrap';
import socketIOClient from "socket.io-client";

const endpoint = "http://127.0.0.1:4444";

function App() {
  // Made a connection with server
  const socket = socketIOClient(endpoint);
  const [initialData, setInitialData] = React.useState(
    {
      socket: null,
      isGameStarted: false,
      isRegistered: false,
      gameId: null,
      gameData: null,
    }
  )

  React.useEffect(() => {
    socket.on("connected", _ => {
      setInitialData({
        ...initialData,
        socket
      });
    });
  }, []);

  const registrationConfirmation = (value) => {
    // If registration successful, redirect to player list
    const data = {
      ...initialData,
      isRegistered: value,
    }
    setInitialData(data);
  };

  const gameStartConfirmation = (data) => {
    // If we select opponent player then start game and redirect to game play
    setInitialData({
      ...initialData,
      isGameStarted: data.status, 
      gameId: data.game_id, 
      gameData: data.game_data 
    });
  };

  const opponentLeft = (data) => {
    // If opponent left then get back from game play to player screen
    alert("Opponent Left");
    setInitialData({ 
      ...initialData,
      isGameStarted: false,
      gameId: null, 
      gameData: null 
    });
  };

  return (
    <>
    <Container>
      {
        !initialData.isGameStarted ? !initialData.isRegistered ? <div className="playerLogin">
          {initialData.socket
            ? <PlayerLogin socket={initialData.socket} registrationConfirmation={registrationConfirmation} />
            : <p>Loading...</p>}
        </div> :
          <Players socket={initialData.socket} gameStartConfirmation={gameStartConfirmation} /> :
          <PlayGame socket={initialData.socket} gameId={initialData.gameId} gameData={initialData.gameData} opponentLeft={opponentLeft} />
      }
    </Container>
    <ParticlesBg type="random" bg={true} />
    </>
  );
}

export default App;

