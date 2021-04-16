import React from 'react';
import { Layout, Menu } from 'antd';
import { navigate, Router } from '@reach/router';
import 'antd/dist/antd.css'
import Overview from './pages/overview';
import Accounts from './pages/accounts';
import Categories from './pages/categories';

const { Sider, Header, Content } = Layout;

function App() {

  const handleNav = (event) => {
    navigate(`/${event.key}`);
  }

  return (
    <Layout>
      <Sider
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
        }}
      >
        <Menu theme='dark' mode='inline' defaultSelectedKeys={['overview']} onClick={handleNav}>
          <Menu.Item key='overview'>
            Overview
          </Menu.Item>
          <Menu.Item key='accounts'>
            Accounts
          </Menu.Item>
          <Menu.Item key='categories'>
            Categories
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout style={{ marginLeft: 200, minHeight: '100vh', height: '100%' }} theme='light'>
        <Content>
          <Router>
            <Overview path='/overview' />
            <Accounts path='/accounts' />
            <Categories path='/categories' />
          </Router>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
