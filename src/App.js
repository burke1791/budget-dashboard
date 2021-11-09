import React from 'react';
import { Layout } from 'antd';
import 'antd/dist/antd.css'

import { BudgetProvider } from './context/budgetContext';
import MainWrapper from './components/mainWrapper';
import Sidenav from './navigation/sidenav';

function App() {

  return (
    <BudgetProvider>
      <Layout>
        <Sidenav />

        <MainWrapper />
      </Layout>
    </BudgetProvider>
  );
}

export default App;
