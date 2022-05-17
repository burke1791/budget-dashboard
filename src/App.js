import React from 'react';
import { Layout } from 'antd';
import 'antd/dist/antd.css'

import { BudgetProvider } from './context/budgetContext';
import MainWrapper from './components/mainWrapper';
import Sidenav from './navigation/sidenav';
import { BrowserRouter } from 'react-router-dom';

function App() {

  return (
    <BrowserRouter>
      <BudgetProvider>
        <Layout>
          <Sidenav />

          <MainWrapper />
        </Layout>
      </BudgetProvider>
    </BrowserRouter>
  );
}

export default App;
