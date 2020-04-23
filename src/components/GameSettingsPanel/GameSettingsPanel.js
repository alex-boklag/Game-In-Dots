import React from 'react';
import gameFlowStarter from '../../services/gameFlowStarter';
import './GameSettingsPanel.css';

const GameSettingPanel = (props) => {
  const { gameSettings, handleInput, handleSelect } = props;

  return (
    <section className="game-setting-panel">
      <select
        value={gameSettings.mode}
        onChange={(ev) => handleSelect(ev.target.value)}
      >
        <option value="">Pick game mode ▾</option>
        <option value="easyMode">Easy mode</option>
        <option value="normalMode">Normal mode</option>
        <option value="hardMode">Hard mode</option>
      </select>
      <input
        type='text'
        placeholder='Enter your name'
        value={gameSettings.userName}
        onChange={(ev) => handleInput(ev.target.value)}
      />
      <button
        onClick={() => gameFlowStarter(props)}
        disabled={(gameSettings.mode && gameSettings.userName) ? false : true}
      >
        {(gameSettings.winner) ? 'PLAY AGAIN' : 'PLAY'}
      </button>
    </section>
  );
}

export default GameSettingPanel;