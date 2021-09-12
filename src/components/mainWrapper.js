import React, { useEffect } from 'react';
import { Layout } from 'antd';
import { Router } from '@reach/router';
import Budget from '../pages/budget';
import Accounts from '../pages/accounts';
import Categories from '../pages/categories';

import 'antd/dist/antd.css';
import useData from '../hooks/useData';
import { ENDPOINTS } from '../utilities/constants';
import { parseCategories, parseCashFlow } from '../utilities/apiHelper';
import { useBudgetDispatch } from '../context/budgetContext';

function MainWrapper() {

  const [cashFlowArr, cashFlowFetchDate] = useData({ endpoint: ENDPOINTS.CASHFLOW, method: 'GET', processData: parseCashFlow });
  const [categories, categoryFetchDate] = useData({ endpoint: ENDPOINTS.CATEGORIES, method: 'GET', processData: parseCategories });
  const [accounts, accountFetchDate] = useData({ endpoint: ENDPOINTS.ACCOUNTS, method: 'GET' });

  const budgetDispatch = useBudgetDispatch();

  useEffect(() => {
    if (cashFlowArr && cashFlowArr.length > 0) {
      budgetDispatch({ type: 'update', key: 'cashFlowArr', value: cashFlowArr });
    }
  }, [cashFlowFetchDate]);

  useEffect(() => {
    if (categories && categories.length > 0) {
      budgetDispatch({ type: 'update', key: 'budgetCategories', value: categories });
    }
  }, [categoryFetchDate]);

  useEffect(() => {
    if (accounts && accounts.length > 0) {
      budgetDispatch({ type: 'update', key: 'accounts', value: accounts });
    }
  }, [accountFetchDate]);

  return (
    <Layout style={{ marginLeft: 200, minHeight: '100vh', height: '100%' }} theme='light'>
      <Router>
        <Budget path='/budget' />
        <Accounts path='/accounts' />
        <Categories path='/categories' />
      </Router>
    </Layout>
  );
}

export default MainWrapper;