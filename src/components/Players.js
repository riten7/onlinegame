import React from 'react';
import { ListGroup } from 'react-bootstrap';
import './Players.css';

const Players = (props) => {
  const { socket, gameStartConfirmation } = props;
  const [opponents, setOpponents] = React.useState([]);

  React.useEffect(() => {
    socket.on('getOpponentsResponse', data => {
      setOpponents(data);
    });
    socket.on('newOpponentAdded', data => {
      setOpponents([...opponents, data])
    });
    socket.on('opponentDisconnected', data => {
      var flag = false;
      var i = 0;
      for (i = 0; i < opponents.length; i++) {
        if (opponents[i].id === data.id) {
          flag = true;
          break;
        }
      }
      if (flag) {
        var array = [...opponents];
        array.splice(i, 1);
        setOpponents(array);
      }
    });
    socket.on('excludePlayers', data => {
      for (var j = 0; j < data.length; j++) {
        var flag = false;
        var i = 0;
        for (i = 0; i < opponents.length; i++) {
          if (opponents[i].id === data[j]) {
            flag = true;
            break;
          }
        }
        if (flag) {
          var array = [...opponents];
          array.splice(i, 1);
          setOpponents(array);
        }
      }

    });
    socket.on('gameStarted', data => {
      gameStartConfirmation(data);
    });

    socket.emit('getOpponents', {});
  }, [])

  const selectOpponent = (index) => {
    socket.emit('selectOpponent', { "id": opponents[index].id });
  };

  return (
    <>
      <h2>{opponents.length > 0 ? 'Please select your opponent...' : 'Waiting for other player to join the game...'}</h2>
      <ListGroup>
        {opponents.map(function (opponent, index) {
          return <ListGroup.Item 
          action={true} 
          className="opponent-item" 
          key={index} 
          eventKey={index} 
          onClick={() => selectOpponent(index)}>{opponent.mobile_number} | Played : {opponent.played}  | Won : {opponent.won}  | Draw : {opponent.draw}</ListGroup.Item>;
        })}
      </ListGroup></>
  )
}

export default Players;