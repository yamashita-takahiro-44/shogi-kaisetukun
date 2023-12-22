// ImageBoardPage.js
import React, { useState, useEffect } from 'react';
import { Card, Button } from 'antd';
import { Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';

const { Header, Footer } = Layout;

const ImageBoardPage = () => {
  const [images, setImages] = useState([]);

  // サーバーから画像データを取得する
  useEffect(() => {
    fetch('https://shogikaisetukun.com/imageboard/images') // APIのURLを適宜設定してください
    .then(response => response.json())
    .then(data => {
      console.log(data); // デバッグのためにレスポンスをコンソールに出力
      if (Array.isArray(data)) {
        setImages(data); // サーバーから取得した画像データ
      } else {
        console.error('予期せぬデータ形式:', data);
      }
    })
    .catch(error => {
      console.error('画像データの取得に失敗しました:', error);
    });
}, []);

  // いいねボタンのクリックイベントハンドラ
  const handleLike = imageId => {
    fetch(`https://shogikaisetukun.com/imageboard/images/${imageId}/like`, {
      method: 'POST',
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          setImages(images.map(image =>
            image.id === imageId ? { ...image, likes: data.likes } : image
          ));
        }
      })
      .catch(error => {
        console.error('いいねに失敗しました:', error);
      });
  };

  return (
  <Layout className="layout">
  <Header className="Header">
    <div className="logo" />
    <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['3']}>
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
    <div>
      <h2>画像掲示板</h2>
      <div className="image-board">
        {images.map(image => (
          <Card
            key={image.id}
            hoverable
            style={{ width: 240, margin: '16px' }}
            cover={<img alt="example" src={image.url} />}
          >
            <Button onClick={() => handleLike(image.id)}>いいね！</Button>
            <p>いいね数: {image.likes}</p>
          </Card>
        ))}
      </div>
    </div>
    <Footer style={{ textAlign: 'center' }}>将棋解説くん ©2023 Created by yamashita twitter:@yamashita-44</Footer>
    </Layout>
  );
};

export default ImageBoardPage;
