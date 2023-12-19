import React, { useEffect, useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { useGameState } from './GameStateContext';
import './GameBoard.css';

const GameBoard = () => {
  const { gameState, setGameState } = useGameState();
  const shogiRef = useRef(null);
  const [moves, setMoves] = useState([]);
  const [imageURL, setImageURL] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [board, setBoard] = useState(null);
  const [spMode, setSpMode] = useState("play");

  useEffect(() => {
    const shogiPlayer = shogiRef.current;
    if (!shogiPlayer) return;

    const handleMove = (e) => {
      if (spMode === "play") {
        const newMove = e.detail[0].last_move_info.to_kif;
        setMoves(prevMoves => [...prevMoves, newMove]);
      }
    };

    
    const handleSfenChange = (e) => {
      if (spMode !== "play") {
        const sfen = e.detail[0];
        console.log("SFEN:", sfen); // ログでSFENの値を確認
    
        if (!sfen) {
          console.error("SFEN is undefined or null");
          return;
        }
    
        setBoard(sfen); // 直接SFEN文字列をboardステートにセット
      }
    };
    

    shogiPlayer.addEventListener('ev_play_mode_move', handleMove);
    shogiPlayer.addEventListener('ev_short_sfen_change', handleSfenChange);

    const handleIllegalAccident = (e) => {
      const illegalDetails = e.detail[0];
      const illegalName = illegalDetails.name;
      alert('反則が発生しました: ' + illegalName);
    };

    shogiPlayer.addEventListener('ev_illegal_illegal_accident', handleIllegalAccident);

    return () => {
      shogiPlayer.removeEventListener('ev_play_mode_move', handleMove);
      shogiPlayer.removeEventListener('ev_short_sfen_change', handleSfenChange);
      shogiPlayer.removeEventListener('ev_illegal_illegal_accident', handleIllegalAccident);
    };
  }, [spMode]);

  useEffect(() => {
    if (shogiRef.current) {
      shogiRef.current.setAttribute('sp_mode', spMode);
      shogiRef.current.setAttribute('sp_turn', spMode === "play" ? "" : "-1");
      shogiRef.current.setAttribute('sp_slider', spMode !== "play" ? "true" : "false");
    }
  }, [spMode, shogiRef]);
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileContent = e.target.result;
        setSpMode("replay"); // 再生モードを示す値に設定
        if (shogiRef.current) {
          shogiRef.current.setAttribute('sp_body', fileContent); // sp_body 属性を設定
        }
      };
      reader.readAsText(file);
    }
  };
  
  useEffect(() => {
    if (shogiRef.current) {
      if (spMode === "replay") {
        shogiRef.current.removeAttribute('sp_mode'); // 再生モードの場合は sp_mode 属性を削除
        shogiRef.current.setAttribute('sp_slider', "true"); // スライダーを表示
        shogiRef.current.setAttribute('sp_controller', "true"); // コントローラを表示
      } else {
        shogiRef.current.setAttribute('sp_mode', "play"); // 操作モードの場合は sp_mode を設定
        shogiRef.current.setAttribute('sp_slider', "false"); // スライダーを非表示
      }
    }
  }, [spMode, shogiRef]);
  
  const handleExplain = () => {
    setIsLoading(true);
  
    let requestBody = board ? { board: board } : { moves: moves };
  
    console.log("Request body:", requestBody);
  
    fetch('https://shogikaisetukun.com/chatgpt/explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    })
    .then(response => response.json())
    .then(data => {
      const explanationText = data.choices[0].message.content;
      setGameState({ ...gameState, response: explanationText });
      setIsLoading(false);
    })
    .catch(error => {
      console.error('Error:', error);
      setIsLoading(false);
    });
  };

  const captureShogiBoard = () => {
    return new Promise((resolve, reject) => {
      const captureArea = document.getElementById("capture-area");
      if (captureArea) {
        html2canvas(captureArea)
          .then(canvas => {
            const dataURL = canvas.toDataURL('image/png');
            return uploadImage(dataURL);
          })
          .then(imageURL => { // imageURL をここで受け取る
            resolve(imageURL);
          })
          .catch(error => {
            console.error('キャプチャに失敗しました: ', error);
            reject(error);
          });
      } else {
        reject('キャプチャエリアが見つかりません。');
      }
    });
  };
  
  const uploadImage = (dataURL) => {
    return fetch('https://shogikaisetukun.com/images', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: dataURL })
    })
    .then(response => response.json())
    .then(data => {
      setImageURL(data.imageUrl);
      return data.imageUrl; // ここで imageURL を返す
    });
  };
  
  const handleTwitterShare = (imageURL) => { // imageURL を引数として受け取る
    const appUrl = "https://shogikaisetukun.com/";
    const twitterText = `${gameState.response.slice(0, 100)}... ${appUrl} ${imageURL}`;
  
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}`;
    window.open(twitterUrl, '_blank');
  };
  
  const handleCaptureAndShare = () => {
    captureShogiBoard()
      .then(imageURL => { // captureShogiBoard から imageURL を受け取る
        handleTwitterShare(imageURL);
      })
      .catch(error => {
        console.error('キャプチャまたは共有に問題が発生しました: ', error);
      });
  };
  

  return (
    <div>
      <div class="file-input-container">
        <input type="file" onChange={handleFileChange} />
      </div>
      <div id="capture-area">
      <div className="shogi-player-container">
        <shogi-player-wc
          ref={shogiRef}
          sp_controller="true" // コントローラを常に表示
          sp_illegal_cancel="true"
          sp_slider={spMode !== "play"} // 再生モードのみスライダーを表示
        ></shogi-player-wc>
      </div>
        <div className="explanation-container">
          <button className="explain-button" onClick={handleExplain} disabled={isLoading}>{isLoading ? '検討中...' : '解説'}</button>
          <button className="twitter-share-button" onClick={handleCaptureAndShare}>Twitterで共有</button>
          <div className="explanation">
            {isLoading ? <p>検討中です...</p> : gameState.response ? <p>{gameState.response}</p> : <p>解説はまだありません</p>}
          </div>
        </div>
      </div>
    </div>
  );

  }

export default GameBoard;
