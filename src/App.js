import React from 'react';
import { Layout, Menu } from 'antd';
import { navigate, Router } from '@reach/router';
import 'antd/dist/antd.css'

import { BudgetProvider } from './context/budgetContext';
import MainWrapper from './components/mainWrapper';

const { Sider } = Layout;

function App() {

  const handleNav = (event) => {
    navigate(`/${event.key}`);
  }

  return (
    <BudgetProvider>
      <Layout>
        <Sider
          style={{
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            left: 0,
          }}
        >
          <Menu theme='dark' mode='inline' defaultSelectedKeys={['budget']} onClick={handleNav}>
            <Menu.Item key='budget'>
              Budget
            </Menu.Item>
            <Menu.Item key='accounts'>
              Accounts
            </Menu.Item>
            <Menu.Item key='categories'>
              Categories
            </Menu.Item>
          </Menu>
        </Sider>

        <MainWrapper />
      </Layout>
    </BudgetProvider>
  );
}

export default App;
