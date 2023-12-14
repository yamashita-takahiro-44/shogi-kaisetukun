import React, { useRef, useEffect } from 'react';
import { GameStateProvider } from './components/GameStateContext';
import GameBoard from './components/GameBoard';
import './App.css'; // カスタムCSS

function App() {
  const spRef = useRef(null);

  useEffect(() => {
    if (spRef.current) {
      spRef.current.addEventListener("ev_play_mode_move", e => {
        console.log(e.detail[0].last_move_info.to_kif);
      });
    }
  }, []);

  return (
    <GameStateProvider>
      <div className="App container">
        <h1 className="app-title">将棋解説くん</h1>
        <GameBoard spRef={spRef} />
      </div>
    </GameStateProvider>
  );
}

export default App;
