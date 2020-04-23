import React from 'react';
import randomGenerator from './randomGenerator';

const gameFlowStarter = (props) => {
  if (props.gameSettings.winner) {
    resetGame(props);
  }
  else {
    startGame(props);
  }
}

const resetGame = (props) => {
  const { gameSettings: { gameSquares }, changeGameSettings } = props;

  const initialGameSquares = gameSquares.map(row => {
    React.Children.forEach(row.props.children, (cell, cellIndex) => {
      row.props.children[cellIndex] = React.cloneElement(cell, { className: '' })
    });
    return React.cloneElement(row);
  });

  changeGameSettings(initialGameSquares);
}

const startGame = (props) => {
  const {
    gameSettings: { mode, modes, playersScore, userName, gameSquares },
    changeGameSettings,
    changeWinner
  } = props;

  console.log(playersScore);

  const fiftyPercentScores = modes[mode].field * modes[mode].field / 2;

  if (playersScore.computer > fiftyPercentScores || playersScore.user > fiftyPercentScores) {
    (playersScore.computer > playersScore.user)
      ? changeWinner('Computer')
      : changeWinner(userName);
  }
  else {
    setTimeout(() => {
      let player = 'nobody';

      const updatedGameSquares = gameSquares.map(row => {
        React.Children.forEach(row.props.children, (cell, cellIndex) => {
          if (cell.props.className === 'blue') {
            row.props.children[cellIndex] = React.cloneElement(cell, { className: 'red' });
            player = 'computer';
          }
        });
        return React.cloneElement(row);
      });

      paintRandomSquare(updatedGameSquares, modes[mode].field, playersScore);

      changeGameSettings(updatedGameSquares, player);

    }, modes[mode].delay);
  }
}

const paintRandomSquare = (updatedGameSquares, field, playersScore) => {
  const fiftyPercentScores = field * field / 2;

  if (playersScore.computer + 1 <= fiftyPercentScores && playersScore.user + 1 <= fiftyPercentScores) {
    let i = randomGenerator(0, field - 1);
    let j = randomGenerator(0, field - 1);

    while (updatedGameSquares[i].props.children[j].props.className !== '') {
      i = randomGenerator(0, field - 1);
      j = randomGenerator(0, field - 1);
    }

    updatedGameSquares[i].props.children[j] = React.cloneElement(
      updatedGameSquares[i].props.children[j],
      { className: 'blue' }
    );
  }
}

export default gameFlowStarter;