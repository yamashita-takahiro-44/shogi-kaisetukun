import React, { useState, useEffect } from 'react';
import { Card, Button, Input } from 'antd';

const AdminPage = () => {
  const [images, setImages] = useState([]);
  const [token, setToken] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchImages();
    }
  }, [isAuthenticated]);

  // 画像データを取得する関数
  const fetchImages = () => {
    fetch('https://shogikaisetukun.com/api/images')
      .then(response => response.json())
      .then(data => setImages(data))
      .catch(error => console.error('画像の読み込みに失敗しました:', error));
  };

  // 画像を削除する関数
  const handleDelete = (imageId) => {
    fetch(`https://shogikaisetukun.com/api/images/${imageId}`, {
      method: 'DELETE',
      headers: { 'Authorization': token }
    })
    .then(response => {
      if (response.ok) {
        setImages(images.filter(image => image.id !== imageId));
      } else {
        alert('画像の削除に失敗しました');
      }
    })
    .catch(error => console.error('画像の削除に失敗しました:', error));
  };

  return (
    <div>
      {!isAuthenticated && (
        <div>
          <Input
            type="password"
            placeholder="トークンを入力"
            value={token}
            onChange={e => setToken(e.target.value)}
          />
          <Button onClick={() => setIsAuthenticated(true)}>ログイン</Button>
        </div>
      )}
      {isAuthenticated && images.map(image => (
        <Card key={image.id}>
          <img alt="example" src={image.url} style={{ width: '100%', height: 'auto' }} />
          <Button onClick={() => handleDelete(image.id)}>削除</Button>
        </Card>
      ))}
    </div>
  );
};

export default AdminPage;
