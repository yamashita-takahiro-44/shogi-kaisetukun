import React, { useEffect, useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { useGameState } from './GameStateContext';
import './GameBoard.css';

const GameBoard = () => {
  const { gameState, setGameState } = useGameState();
  const shogiRef = useRef(null);
  const [moves, setMoves] = useState([]);
  const [imageURL, setImageURL] = useState('');
  const [isLoading, setIsLoading] = useState(false);  // ローディング状態を管理するステート

  useEffect(() => {
    const shogiPlayer = shogiRef.current;
    if (!shogiPlayer) return;

    const handleMove = (e) => {
      const newMove = e.detail[0].last_move_info.to_kif;
      setMoves(prevMoves => [...prevMoves, newMove]);
    };

    shogiPlayer.addEventListener('ev_play_mode_move', handleMove);

    return () => {
      shogiPlayer.removeEventListener('ev_play_mode_move', handleMove);
    };
  }, []);

  const handleExplain = () => {
    setIsLoading(true);  // ローディング状態をtrueに設定
    fetch('https://shogikaisetukun.com/chatgpt/explain', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ moves: moves })
    })
    .then(response => response.json())
    .then(data => {
      const explanationText = data.choices[0].text;
      setGameState({ ...gameState, response: explanationText });
      setIsLoading(false);  // ローディング状態をfalseに設定
    })
    .catch(error => {
      console.error('Error:', error);
      setIsLoading(false);  // エラー発生時もローディング状態をfalseに設定
    });
  };

  const captureShogiBoard = () => {
    if (shogiRef.current) {
      html2canvas(shogiRef.current)
        .then(canvas => {
          const dataURL = canvas.toDataURL('image/png');
          uploadImage(dataURL);
        })
        .catch(error => {
          console.error('キャプチャに失敗しました: ', error);
        });
    }
  };

  const uploadImage = (dataURL) => {
    fetch('https://shogikaisetukun.com/images', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: dataURL }),
    })
    .then(response => response.json())
    .then(data => {
      setImageURL(data.imageUrl);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };

  const handleTwitterShare = () => {
    if (!imageURL) {
      alert('まず将棋盤をキャプチャしてください。');
      return;
    }
  
    const appUrl = "https://shogikaisetukun.com/"; // アプリのURL
    const twitterText = `${gameState.response.slice(0, 100)}... ${appUrl} ${imageURL}`;
  
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}`;
    window.open(twitterUrl, '_blank');
  };
  

  return (
    <div>
      <shogi-player-wc ref={shogiRef} sp_mode="play" sp_controller="true"></shogi-player-wc>
      <div className="explanation-container">
        <button className="explain-button" onClick={handleExplain} disabled={isLoading}>解説</button>
        <button className="capture-button" onClick={captureShogiBoard}>キャプチャ</button>
        <button className="twitter-share-button" onClick={handleTwitterShare}>Twitterで共有</button>
        <div className="explanation">
          {isLoading ? <p>検討中です...</p> : gameState.response ? <p>{gameState.response}</p> : <p>解説はまだありません</p>}
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
