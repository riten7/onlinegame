import React from 'react';
import { Table, Row, Col } from 'react-bootstrap';
import './PlayGame.css';

const PlayGame = (props) => {
  const { gameData, gameId, socket, opponentLeft } = props;

  const [initializeData, setInitializeData] = React.useState({
    gameData,
    gameId,
    gameBetweenSeconds: 10,
  });

  React.useEffect(() => {
    socket.on('selectCellResponse', data => {
      setInitializeData(reducer({
        type: 'selectCellResponse',
        data
      }))
    });
    socket.on('gameInterval', data => {
      setInitializeData(reducer({
        type: 'gameInterval',
        data
      }))
    });
    socket.on('nextGameData', data => {
      setInitializeData(reducer({
        type: 'nextGameData',
        data
      }))
    });
    socket.on('opponentLeft', _ => {
      opponentLeft();
    });
  }, [opponentLeft, socket]);

  const generateCellDOM = () => {
    let table = []
    for (let i = 0; i < 3; i++) {
      let children = []
      for (let j = 0; j < 3; j++) {
        var showWinnerCell = false;
        if (initializeData.gameData.game_status === "won") {
          for (let k = 0; k < initializeData.gameData.winning_combination.length; k++) {
            if (i === initializeData.gameData.winning_combination[k][0] && j === initializeData.gameData.winning_combination[k][1]) {
              showWinnerCell = true;
              break;
            }
          }
        }
        children.push(<td key={"cell" + i + j} className={showWinnerCell ? "winner-cell" : ""} >
          <div key={"cell-div" + i + j}
            className={"cell cell-" + initializeData.gameData.playboard[i][j]}
            onClick={(initializeData.gameData.game_status !== "ongoing" || socket.id !== initializeData.gameData.whose_turn ||
              initializeData.gameData.playboard[i][j] ? () => void (0) : () => selectCell(i, j))}></div></td>)
      }
      table.push(<tr key={"row" + i} >{children}</tr>)
    }
    return table
  }

  const selectCell = (i, j) => {
    const id = initializeData.gameId;
    socket.emit('selectCell', { gameId: id, "i": i, "j": j });
  };

  return (
    gameData ? <>
      <Row>
        <Col>
          <p className={"text-center " + (socket.id !== gameData.whose_turn ? "active-player" : "")}>
            {socket.id === initializeData.gameData.player1 ?
              (initializeData.gameData.game_status === "won" && initializeData.gameData.game_winner === initializeData.gameData.player2 ?
                "Opponent is Winner!!! " : " ") + initializeData.gameData[initializeData.gameData.player2].mobile_number + " | Played : "
              + initializeData.gameData[initializeData.gameData.player2].played + " | Won : " + initializeData.gameData[initializeData.gameData.player2].won
              + " | Draw : " + initializeData.gameData[initializeData.gameData.player2].draw
              : (initializeData.gameData.game_status === "won" && initializeData.gameData.game_winner === initializeData.gameData.player1 ?
                "Opponent is Winner!!! " : " ") + initializeData.gameData[initializeData.gameData.player1].mobile_number + " | Played : "
              + initializeData.gameData[initializeData.gameData.player1].played + " | Won : " + initializeData.gameData[initializeData.gameData.player1].won
              + " | Draw : " + initializeData.gameData[initializeData.gameData.player1].draw}
          </p>
        </Col>
      </Row>
      <Row>
        <Col>
          <Table bordered>
            <tbody>
              {
                generateCellDOM()
              }
            </tbody>
          </Table>
        </Col>
      </Row>
      <Row>
        <Col>
          <p className={"text-center " + (socket.id === initializeData.gameData.whose_turn ? "active-player" : "")}>{
            socket.id === initializeData.gameData.player1 ?
              (initializeData.gameData.game_status === "won" && initializeData.gameData.game_winner === initializeData.gameData.player1 ?
                "You are Winner!!! " : " ") + initializeData.gameData[initializeData.gameData.player1].mobile_number + " | Played : "
              + initializeData.gameData[initializeData.gameData.player1].played + " | Won : " + initializeData.gameData[initializeData.gameData.player1].won
              + " | Draw : " + initializeData.gameData[initializeData.gameData.player1].draw
              : (initializeData.gameData.game_status === "won" && initializeData.gameData.game_winner === initializeData.gameData.player2 ?
                "You are Winner!!! " : " ") + initializeData.gameData[initializeData.gameData.player2].mobile_number + " | Played : "
              + initializeData.gameData[initializeData.gameData.player2].played + " | Won : " + initializeData.gameData[initializeData.gameData.player2].won
              + " | Draw : " + initializeData.gameData[initializeData.gameData.player2].draw}
          </p>
        </Col>
      </Row>
      <Row>
        <Col>
          <p className="text-center">
            {initializeData.gameData.game_status === "won" ? "New Game will be start in " + initializeData.gameBetweenSeconds + " seconds." : ""}
          </p>
        </Col>
      </Row>
    </> : <p>Gathering Data</p>
  )
}

export default PlayGame;

export const reducer = action => (state) => {
  switch (action.type) {
    case 'selectCellResponse':
      return {
        ...state,
        gameData: action.data
      };
    case 'gameInterval':
      return {
        ...state,
        gameBetweenSeconds: action.data
      };

    case 'nextGameData':
      return {
        ...state,
        gameId: action.data.game_id,
        gameData: action.data.game_data,
        gameBetweenSeconds: 10,
      }
    default:
      return null;
  }
};