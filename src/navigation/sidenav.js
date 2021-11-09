import React from 'react';
import { navigate } from '@reach/router';
import { Layout, Menu } from 'antd';
import 'antd/dist/antd.css'

const { Sider } = Layout;

function Sidenav(props) {

  const handleNav = (event) => {
    navigate(`/${event.key}`);
  }

  return (
    <Sider
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
      }}
    >
      <Menu theme='dark' mode='inline' defaultSelectedKeys={['dashboard']} onClick={handleNav}>
        <Menu.Item key='dashboard'>
          Dashboard
        </Menu.Item>
        <Menu.Item key='budget'>
          Budget
        </Menu.Item>
        <Menu.Item key='accounts'>
          Accounts
        </Menu.Item>
        <Menu.Item key='transactions'>
          Transactions
        </Menu.Item>
        <Menu.Item key='categories'>
          Categories
        </Menu.Item>
      </Menu>
    </Sider>
  );
}

export default Sidenav;