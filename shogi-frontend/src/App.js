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
        {/* 説明文の追加 */}
        <div className="instructions">
          <h2>使い方</h2>
          <p>
            棋譜を下のフォームからアップロード（.kifと.sfenに対応）<br />
            あるいは盤面を一手ずつ動かしてください。<br />
            解説ボタンを押してください。将棋解説くんが一生懸命解説します。<br />
            twitterで共有して楽しんでください。<br />
            棋譜プリセット、GPTのバージョン、プロンプトも選べます。
          </p>
        </div>
        <GameBoard spRef={spRef} />
      </div>
    </GameStateProvider>
  );
}

export default App;
