import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'antd';
import { Layout, Menu } from 'antd';

const { Header, Footer } = Layout;

const RankingPage = () => {
  const [rankedImages, setRankedImages] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/images/ranking') // APIのURLを適宜設定
      .then(response => response.json())
      .then(data => {
        console.log('Fetched Data:', data); // デバッグ用
        if (Array.isArray(data)) {
          setRankedImages(data);
        } else {
          console.error('データ形式が不正です:', data);
        }
      })
      .catch(error => {
        console.error('ランキングデータの取得に失敗しました:', error);
      });
  }, []);

  return (
    <Layout className="layout">
    <Header className="Header">
      <div className="logo" />
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['4']}>
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
      <h2>画像ランキング</h2>
      <div className="ranking-board">
        {rankedImages.map((image, index) => (
          <Card
            key={image.id}
            hoverable
            style={{ width: 240, margin: '16px' }}
            cover={<img alt={`ランキング${index + 1}位`} src={image.url} />}
          >
            <p>いいね数: {image.likes}</p>
          </Card>
        ))}
      </div>
    </div>
    <Footer style={{ textAlign: 'center' }}>将棋解説くん ©2023 Created by yamashita twitter:@yamashita-44</Footer>
    </Layout>
  );
};

export default RankingPage;
