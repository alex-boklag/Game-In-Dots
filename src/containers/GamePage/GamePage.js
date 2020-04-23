import React, { useState, useEffect } from 'react';
import GameSettingsPanel from '../../components/GameSettingsPanel/GameSettingsPanel';
import Message from '../../components/Message/Message';
import GameField from '../../components/GameField/GameField';
import LeaderBoard from '../../components/LeaderBoard/LeaderBoard';
import gameFlowStarter from '../../services/gameFlowStarter';
import './GamePage.css';

function GamePage() {
  const [gameSettings, setGameSettings] = useState({
    mode: '',
    userName: '',
    gameSquares: [],
    playersScore: {
      user: 0,
      computer: 0
    },
    winner: '',
    step: 0
  });
  const [winnersHistory, setWinersHistory] = useState([]);

  const handleInput = (value) => {
    setGameSettings(prevGameSettings => ({ ...prevGameSettings, userName: value }))
  }
  const handleSelect = (value) => {
    const cells = [], rows = [];

    if (value) {
      for (let i = 0; i < gameSettings.modes[value].field; i++) {
        cells[i] = [];
        for (let j = 0; j < gameSettings.modes[value].field; j++) {
          cells[i][j] = <td key={j} data-id={`${i}${j}`} className=''></td>;
        }
        rows.push(<tr key={i}>{cells[i]}</tr>);
      }
    }

    setGameSettings(prevGameSettings => ({
      ...prevGameSettings,
      mode: value,
      gameSquares: rows,
      playersScore: { user: 0, computer: 0 },
      winner: ''
    }));
  }
  const handleSquareClick = (id) => {
    let player = '';

    const updatedGameSquares = gameSettings.gameSquares.map((row, rowIndex) => {
      React.Children.forEach(row.props.children, (cell, cellIndex) => {
        if (cell.props.className === 'blue' && id === `${rowIndex}${cellIndex}`) {
          row.props.children[cellIndex] = React.cloneElement(cell, { className: 'green' });
          player = 'user';
        }
      });
      return React.cloneElement(row);
    });

    if (player === 'user') {
      changeGameSettings(updatedGameSquares, player);
    }
  }
  const changeGameSettings = (value, player) => {
    if (!player) {
      setGameSettings(prevGameSettings => {
        return {
          ...prevGameSettings,
          gameSquares: value,
          playersScore: {
            user: 0,
            computer: 0
          },
          winner: '',
          step: 0
        }
      })
    }
    if (player === 'nobody') {
      setGameSettings(prevGameSettings => {
        return {
          ...prevGameSettings,
          gameSquares: value,
          step: prevGameSettings.step + 1
        }
      })
    }
    if (player === 'computer') {
      setGameSettings(prevGameSettings => {
        return {
          ...prevGameSettings,
          gameSquares: value,
          playersScore: {
            ...prevGameSettings.playersScore,
            computer: prevGameSettings.playersScore.computer + 1
          },
          step: prevGameSettings.step + 1
        }
      })
    }
    if (player === 'user') {
      setGameSettings(prevGameSettings => {
        return {
          ...prevGameSettings,
          gameSquares: value,
          playersScore: {
            ...prevGameSettings.playersScore,
            user: prevGameSettings.playersScore.user + 1,
          }
        }
      })
    }
  }
  const changeWinner = (winner) => {
    setGameSettings({ ...gameSettings, winner });

    if (winner) {
      const d = new Date();

      const minutes = (d.getMinutes() > 9) ? d.getMinutes() : `0${d.getMinutes()}`;
      const hours = (d.getHours() > 9) ? d.getHours() : `0${d.getHours()}`;
      const date = (d.getDate() > 9) ? d.getDate() : `0${d.getDate()}`;
      const month = (d.getMonth() > 9) ? d.getMonth() + 1 : `0${d.getMonth() + 1}`;

      const result = `${hours}:${minutes}; ${date}.${month}.${d.getFullYear()}`;

      setWinersHistory([...winnersHistory, { winner, date: result }]);
    }
  }

  useEffect(() => {
    fetch('https://starnavi-frontend-test-task.herokuapp.com/game-settings')
      .then(response => response.json())
      .then(data => setGameSettings({ ...gameSettings, modes: data }));
  }, []);
  useEffect(() => {
    fetch('https://starnavi-frontend-test-task.herokuapp.com/winners')
      .then(response => response.json())
      .then(data => setWinersHistory(data));
  }, []);
  useEffect(() => {
    if (gameSettings.winner) {
      fetch('https://starnavi-frontend-test-task.herokuapp.com/winners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(winnersHistory[winnersHistory.length - 1])
      });
    }
  }, [winnersHistory]);
  useEffect(() => {
    if (gameSettings.mode) {
      gameFlowStarter({ gameSettings, changeGameSettings, changeWinner });
    }
  }, [gameSettings.step])

  return (
    <article className="game-page">
      <div className="game">
        <GameSettingsPanel
          gameSettings={gameSettings}
          handleInput={handleInput}
          handleSelect={handleSelect}
          changeGameSettings={changeGameSettings}
          changeWinner={changeWinner}
        />
        <Message
          text={gameSettings.winner ? `${gameSettings.winner} won!` : ''}
        />
        <GameField
          gameSquares={gameSettings.gameSquares}
          handleSquareClick={handleSquareClick}
        />
      </div>
      <LeaderBoard
        winners={winnersHistory}
      />
    </article >
  );
}

export default GamePage;