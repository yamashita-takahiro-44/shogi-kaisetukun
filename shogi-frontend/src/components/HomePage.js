// HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu, Typography } from 'antd';
import './HomePage.css'; // カスタムスタイルシート

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const HomePage = () => {
  return (
    <Layout className="layout">
      <Header>
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
          <Menu.Item key="1">ホーム</Menu.Item>
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
      <Content style={{ padding: '0 50px' }}>
        <div className="site-layout-content">
          <Title level={2}>将棋解説くんへようこそ</Title>
          <p>将棋解説くんは、将棋をGPTが解説してくれるアプリです。</p>
          <p>将棋解説を生成し、共有して楽しみましょう。</p>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>将棋解説くん ©2023 Created by yamashita twitter:@yamashita-44</Footer>
    </Layout>
  );
};

export default HomePage;
