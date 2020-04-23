import React from 'react';
import './GameField.css';

const GameField = ({ gameSquares, handleSquareClick }) => {
  return (
    <section className="game-field">
      <table onClick={ev => handleSquareClick(ev.target.getAttribute('data-id'))}>
        <tbody>
          {gameSquares}
        </tbody>
      </table>
    </section>
  );
}

export default GameField;