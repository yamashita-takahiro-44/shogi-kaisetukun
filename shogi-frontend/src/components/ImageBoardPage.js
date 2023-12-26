import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Input, List } from 'antd';
import { Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import './ImageBoardPage.css';

const { Header, Footer } = Layout;
const { TextArea } = Input;

const ImageBoardPage = () => {
  const [images, setImages] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState('');
  const [modalImageId, setModalImageId] = useState(null);
  const [likedImages, setLikedImages] = useState({});
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    fetch('https://shogikaisetukun.fly.dev/api/images')
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          setImages(data);
        } else {
          console.error('予期せぬデータ形式:', data);
        }
      })
      .catch(error => {
        console.error('画像データの取得に失敗しました:', error);
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

  const handleLike = imageId => {
    if (likedImages[imageId]) {
      alert('いいねは1回までです');
      return;
    }

    fetch(`https://shogikaisetukun.fly.dev/api/images/${imageId}/like`, {
      method: 'POST',
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        setImages(images.map(image =>
          image.id === imageId ? { ...image, likes: data.likes } : image
        ));
        setLikedImages({ ...likedImages, [imageId]: true });
      }
    })
    .catch(error => {
      console.error('いいねに失敗しました:', error);
    });
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

  const handleAddComment = () => {
    fetch(`https://shogikaisetukun.fly.dev/api/images/${modalImageId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ comment: { content: newComment, image_id: modalImageId } })
    })
    .then(response => response.json())
    .then(data => {
      setNewComment('');
      fetchComments(modalImageId);
    })
    .catch(error => {
      console.error('コメントの追加に失敗しました:', error);
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
        <div className="image-board">
          {images.map(image => (
            <Card
              key={image.id}
              hoverable
              style={{ width: 240, margin: '16px' }}
              cover={<img alt="example" src={image.url} onClick={() => showModal(image.url, image.id)} />}
            >
              <Button 
                onClick={() => handleLike(image.id)} 
                disabled={likedImages[image.id]}
              >
                いいね！
              </Button>
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
        <TextArea rows={4} value={newComment} onChange={e => setNewComment(e.target.value)} />
        <Button onClick={handleAddComment} type="primary">コメントを追加</Button>
      </Modal>
      <Footer style={{ textAlign: 'center' }}>将棋解説くん ©2023 Created by yamashita twitter:@yamashita-44</Footer>
    </Layout>
  );
};

export default ImageBoardPage;
