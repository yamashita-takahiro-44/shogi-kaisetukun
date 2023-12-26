import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Modal, List } from 'antd';
import { Layout, Menu } from 'antd';
import './RankingPage.css';

const { Header, Footer } = Layout;

const RankingPage = () => {
  const [rankedImages, setRankedImages] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState('');
  const [modalImageId, setModalImageId] = useState(null);
  const [comments, setComments] = useState({});

  useEffect(() => {
    fetch('https://shogikaisetukun.fly.dev/api/images/ranking')
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRankedImages(data.sort((a, b) => b.likes - a.likes)); // いいね数が多い順にソート
        } else {
          console.error('データ形式が不正です:', data);
        }
      })
      .catch(error => {
        console.error('ランキングデータの取得に失敗しました:', error);
      });
  }, []);

  const showModal = (imageUrl, imageId) => {
    setModalImageUrl(imageUrl);
    setModalImageId(imageId);
    setIsModalVisible(true);
    fetchComments(imageId);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const fetchComments = (imageId) => {
    fetch(`https://shogikaisetukun.fly.dev/api/images/${imageId}/comments`)
      .then(response => response.json())
      .then(data => {
        setComments({ ...comments, [imageId]: data });
      })
      .catch(error => {
        console.error('コメントの取得に失敗しました:', error);
      });
  };

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
              cover={<img alt={`ランキング${index + 1}位`} src={image.url} onClick={() => showModal(image.url, image.id)} />}
            >
              <p>いいね数: {image.likes}</p>
            </Card>
          ))}
        </div>
      </div>
      <Modal open={isModalVisible} footer={null} onCancel={handleCancel}>
        <img alt="Enlarged" src={modalImageUrl} style={{ width: '100%' }} />
        <List
          dataSource={comments[modalImageId] || []}
          renderItem={item => <List.Item>{item.content}</List.Item>}
        />
      </Modal>
      <Footer style={{ textAlign: 'center' }}>将棋解説くん ©2023 Created by yamashita twitter:@yamashita-44</Footer>
    </Layout>
  );
};

export default RankingPage;
