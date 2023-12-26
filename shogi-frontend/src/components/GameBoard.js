import React, { useEffect, useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { message } from 'antd';
import { useGameState } from './GameStateContext';
import './GameBoard.css';
import { Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
const { Content } = Layout;

const kifuPresets = [
  {
    name: "1996-10-29 竜王戦 羽生善治 vs. 谷川浩司 竜王戦 伝説の77桂",
    data: "position sfen lnsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL b - 1 moves 7g7f 8c8d 2g2f 4a3b 6i7h 8d8e 8h7g 3c3d 7i8h 2b7g+ 8h7g 3a4b 3i3h 7a7b 1g1f 1c1d 4g4f 7b8c 3h4g 8c8d 9g9f 4b3c 6g6f 5a4b 6f6e 7c7d 2h6h 8d7c 3g3f 6a5b 4i3h 4b3a 4g5f 4c4d 3h4g 5b4c 2i3g 5c5d 5i6i 8b5b 6i7i 5d5e 5f6g 3a2b 7i8h 9c9d 6g6f 9a9c B*6a 5b6b 6a8c+ B*9b 8c9b 6b9b 3g2e 3c4b 4f4e 4d4e 6f5e 2c2d 6e6d 6c6d 4g5f 2d2e 5e6d P*5e 6d5e 7d7e P*4d 4c3c B*5d 7e7f 7g7f P*7e 5d8a+ 9b6b 8a6c B*5i 6h6i N*7g 6i5i 6b6c B*5d B*6h 5i5h 7g8i+ 8h8i 7e7f 5h6h 6c6h+ 7h6h S*7g R*6c R*8h 8i7i 8h6h+ 6c6h+ 7g6h 7i6h R*3h 6h6g G*7g 6g6f 3h6h+ 6f7e N*6c",
  },
  {
    name: "1982-07-30 名人戦加藤一二三 vs. 中原誠 名人戦 語られる名局",
    data: "position sfen lnsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL b - 1 moves 7g7f 8c8d 7i6h 3c3d 6h7g 7a6b 2g2f 3a4b 3i4h 4a3b 5g5f 5c5d 6i7h 5a4a 5i6i 6a5b 3g3f 7c7d 4i5h 4b3c 8h7i 2b3a 6g6f 4c4d 5h6g 5b4c 4h3g 3a6d 7i6h 4a3a 6i7i 3a2b 7i8h 8d8e 1g1f 6b7c 3g4f 7d7e 7f7e 6d7e 2i3g 7c7d 5f5e 5d5e 2h5h 8e8f 7g8f 7e8f 8g8f P*8e 8h7i 8e8f P*8h S*5f 6g5f 5e5f 5h5f P*5d P*5e 5d5e 4f5e 7d7e B*6a P*7g 7h7g G*7f S*7h 7f7g 6h7g 7e7f 6f6e 7f6e 5f8f P*8e 8f4f P*7f 7g6h G*5f P*6f 5f4f 6h4f 6e5f 5e5d 4c5d 4f8b+ S*6g G*6i R*4i P*5i 6g7h+ 7i7h 4i4g+ S*4a 5d5c R*7b P*5b 6a5b+ 5c5b 4a3b+ 2b1b G*2b 3c2b 3b2b 1b2b S*3a",
  },
  {
    name: "2023-10-11永瀬拓矢王座vs.藤井聡太7冠 第71期王座戦第4局 藤井8冠誕生",
    data: "position sfen lnsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL b - 1 moves 2g2f 8c8d 2f2e 8d8e 7g7f 4a3b 8h7g 3c3d 7i8h 2b7g+ 8h7g 3a2b 1g1f 1c1d 3i3h 2b3c 3g3f 7a6b 2i3g 7c7d 4g4f 8a7c 3g4e 3c4d 2e2d 2c2d 2h2d P*2b 3h3g 8e8f 7g8f 4d4e 4f4e B*5e 2d2g 5e9i+ B*7g 9i7g 8i7g 6a5b 7f7e 8b8d 7e7d 8d7d B*3h 7d5d P*7d 5d5g+ S*5h 5g5e 7d7c+ 6b7c 3h8c+ 7c6d N*7f 5a4b 7f6d 6c6d S*4f 5e5d 8c7d 6d6e 7d6e 5d6c 4f5e 6c6b 3g4f N*5d 5e5d 5c5d P*7d P*7b 6e5d 4b3a 5d5e S*6d 5e5f N*5d 4f5e 6d5e 5f5e B*4f 5e5d L*5c 5d7f P*5g P*5d 5g5h+ 6i5h P*5g 5h5g 5c5d 7f5d 4f5g+ 2g5g P*5f B*7e 5b4b 5g5h S*5g S*6c 5g5h 5i5h S*5g 7e5g 5f5g+ 5h5g 6b5a P*5b 5a8a L*8e 8a6a S*6b 6a6b 6c6b+ 2b2c 5b5a+ B*3g 5a5b 4b5b 6b5b S*5e 5d5c 3a2b N*3h P*5f 5g6h R*9h N*7h 5f5g+ 6h5g 9h7h+ G*4g N*6f P*5h 6f5h+ 4i5h P*5f",
  },
  // 他の棋譜...
];

const { Header, Footer } = Layout;

const GameBoard = () => {
  const { gameState, setGameState } = useGameState();
  const shogiRef = useRef(null);
  const [moves, setMoves] = useState([]);
  const [imageURL, setImageURL] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [board, setBoard] = useState(null);
  const [spMode, setSpMode] = useState("play");
  const [selectedKifu, setSelectedKifu] = useState("");
  const [model, setModel] = useState("gpt-4-1106-preview");
  const [selectedPromptType, setSelectedPromptType] = useState("解説者");

   // プロンプトの選択肢
   const prompts = [
    { label: "解説者風/ドロップダウンから別パターンも選べます", value: "解説者" },
    { label: "豊川先生風", value: "豊川先生風" },
    { label: "格ゲー実況風", value: "格ゲー実況風" },
    { label: "デーモン閣下風", value: "デーモン閣下風" },
    { label: "知ったかぶり実況", value: "知ったかぶり実況" },
    // 他のプロンプトを追加
  ];
  const handleKifuChange = (e) => {
    const kifuName = e.target.value;
    const kifu = kifuPresets.find(k => k.name === kifuName);
    if (kifu) {
      setSelectedKifu(kifuName);
      shogiRef.current.setAttribute('sp_body', kifu.data);
      setSpMode("replay");
    } else {
      setSelectedKifu("");
      setSpMode("play");
    }
  };
  

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
      shogiRef.current.setAttribute('sp_slider', spMode !== "play" ? "true" : "false");
      shogiRef.current.setAttribute('sp_turn', spMode === "play" ? "" : "80");
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
  
    let requestBody = {
      moves,
      board,
      model,
      selectedPromptType
    };
  
    fetch('https://shogikaisetukun.com/api/chatgpt/explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    })
    .then(response => response.json())
    .then(data => {
      console.log('API Response:', data); // この行を追加
      const explanationText = data.choices && data.choices[0] ? data.choices[0].message.content : "解説が得られませんでした";
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
    return fetch('https://shogikaisetukun.com/api/images', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: dataURL })
    })
    .then(response => response.json())
    .then(data => {
      setImageURL(data.imageUrl); // 画像URLをセット
      return data.imageUrl;
    });
  };
  
  const handleTwitterShare = (imageURL) => {
    const appUrl = "https://shogikaisetukun.com/";
    const twitterText = `${gameState.response.slice(0, 100)}... ${appUrl} ${imageURL}`;
  
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}`;
    window.open(twitterUrl, '_blank');
  };
  
  const handleCaptureAndShare = () => {
    captureShogiBoard()
      .then(imageURL => {
        handleTwitterShare(imageURL); // キャプチャされた画像のURLを使用
      })
      .catch(error => {
        console.error('キャプチャまたは共有に問題が発生しました: ', error);
      });
  };

  const postToImageBoard = () => {
    captureShogiBoard()
      .then(imageURL => {
        fetch('https://shogikaisetukun.com/api/images', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: imageURL })
        })
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('サーバーでエラーが発生しました。');
          }
        })
        .then(data => {
          if (data.imageUrl) {
            message.success('画像が掲示板に投稿されました！');
          } else {
            message.error('投稿に失敗しました。');
          }
        })
        .catch(error => {
          console.error('投稿に失敗しました: ', error);
          message.error('投稿に失敗しました。');
        });
      })
      .catch(error => {
        console.error('画像のキャプチャに失敗しました: ', error);
        message.error('画像のキャプチャに失敗しました。');
      });
  };
  

return (
  <Layout className="layout">
  <Header className="Header">
    <div className="logo" />
    <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
      <Menu.Item key="1">
        <Link to="/">ホーム</Link>
      </Menu.Item>
      <Menu.Item key="2">
        <Link to="/game">ゲーム</Link>
      </Menu.Item>
      <Menu.Item key="3">
          <Link to="/imageboard">画像掲示板</Link>
        </Menu.Item>
      <Menu.Item key="4">
        <Link to="/ranking">ランキング</Link>
      </Menu.Item>
      </Menu>
    </Header>
    <div className="App container">
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
    <Content className="content">
      <div className="file-input-container">
        <input type="file" onChange={handleFileChange} />
      </div>
      <div id="capture-area">
        <div className="dropdown-container">
          <select value={selectedKifu} onChange={handleKifuChange}>
            <option value="">操作モードです/ドロップダウンから棋譜を選択すると再生モードになります</option>
            {kifuPresets.map(kifu => (
              <option key={kifu.name} value={kifu.name}>{kifu.name}</option>
            ))}
          </select>
        </div>
        <div className="dropdown-container">
          <select value={model} onChange={e => setModel(e.target.value)}>
            <option value="gpt-4-1106-preview">GPT-4-1106-preview</option>
            <option value="gpt-3.5-turbo-1106">GPT-3.5-Turbo-1106</option>
          </select>
        </div>
        <div className="dropdown-container">
          <select value={selectedPromptType} onChange={e => setSelectedPromptType(e.target.value)}>
            {prompts.map(prompt => (
              <option value={prompt.value} key={prompt.label}>
                {prompt.label}
              </option>
            ))}
          </select>
        </div>
        <div className="shogi-player-container">
          <shogi-player-wc ref={shogiRef} sp_controller="true" sp_illegal_cancel="true" sp_slider={spMode !== "play"} />
        </div>
        <div className="explanation-container">
          <button className="explain-button" onClick={handleExplain} disabled={isLoading}>
            {isLoading ? '検討中...' : '解説'}
          </button>
          <button className="twitter-share-button" onClick={handleCaptureAndShare}>
            Twitterで共有
          </button>
          <button className="post-to-board-button" onClick={postToImageBoard}>
          掲示板に投稿
          </button>
          <div className="explanation">
            {isLoading ? <p>検討中です...</p> : gameState.response ? <p>{gameState.response}</p> : <p>解説はまだありません</p>}
          </div>
        </div>
      </div>
      </Content>
    </div>
    <Footer style={{ textAlign: 'center' }}>将棋解説くん ©2023 Created by yamashita twitter:@yamashita-44</Footer>
  </Layout>
);
}

export default GameBoard;
