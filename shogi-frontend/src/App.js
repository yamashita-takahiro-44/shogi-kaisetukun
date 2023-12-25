import React, { useRef, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // `Routes`をインポート
import { GameStateProvider } from './components/GameStateContext';
import GameBoard from './components/GameBoard';
import HomePage from './components/HomePage';
import ImageBoardPage from './components/ImageBoardPage';
import RankingPage from './components/RankingPage';
import AdminPage from './components/AdminPage';
import './App.css';

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
      <Router>
        <div className="App container">
          <h1 className="app-title">将棋解説くん</h1>
          <Routes> 
            <Route path="/" element={<HomePage />} /> 
            <Route path="/game" element={(
              <div>
                <GameBoard spRef={spRef} />
              </div>
            )} />
            <Route path="/imageboard" element={<ImageBoardPage />} />
            <Route path="/ranking" element={<RankingPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </div>
      </Router>
    </GameStateProvider>
  );
}

export default App;
