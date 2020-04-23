import React from 'react';
import './LeaderBoard.css';

const LeaderBoard = ({ winners }) => {
  return (
    <section className="leader-board">
      <h2>Leader Board</h2>
      <ul>
        {winners.map((item, index) =>
          <li key={index}><span>{item.winner}</span><span>{item.date}</span></li>
        )}
      </ul>
    </section>
  );
}

export default LeaderBoard;