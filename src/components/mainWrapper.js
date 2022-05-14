import React, { useEffect } from 'react';
import { Layout } from 'antd';
import moment from 'moment';
import Budget from '../pages/budget';
import Accounts from '../pages/accounts';
import Categories from '../pages/categories';
import Dashboard from '../pages/dashboard';
import Transactions from '../pages/transactions';

import 'antd/dist/antd.css';
import useData from '../hooks/useData';
import { ENDPOINTS } from '../utilities/constants';
import { parseCashFlow } from '../utilities/apiHelper';
import { useBudgetDispatch, useBudgetState } from '../context/budgetContext';
import { Route, Routes } from 'react-router-dom';

function MainWrapper() {

  const { merchantsRefreshTrigger } = useBudgetState();
  const budgetDispatch = useBudgetDispatch();

  const [cashFlowArr, cashFlowFetchDate] = useData({ endpoint: ENDPOINTS.CASHFLOW, method: 'GET', processData: parseCashFlow });
  const [categories, categoryFetchDate] = useData({ endpoint: ENDPOINTS.CATEGORIES, method: 'GET' });
  const [accounts, accountFetchDate] = useData({ endpoint: ENDPOINTS.ACCOUNTS, method: 'GET' });
  const [merchants, merchantFetchDate] = useData({
    endpoint: ENDPOINTS.MERCHANTS,
    method: 'GET',
    refreshTrigger: merchantsRefreshTrigger
  });

  useEffect(() => {
    budgetDispatch({ type: 'update', key: 'budgetMonth', value: moment().format('YYYY-MM') });
  }, []);

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

  useEffect(() => {
    if (merchants && merchants.length > 0) {
      budgetDispatch({ type: 'update', key: 'merchants', value: merchants });
      budgetDispatch({ type: 'update', key: 'merchantFetchDate', value: new Date() });
    }
  }, [merchantFetchDate]);

  return (
    <Layout style={{ marginLeft: 200, minHeight: '100vh', height: '100%' }} theme='light'>
      <Routes>
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/budget' element={<Budget />} />
        <Route path='/accounts' element={<Accounts />} />
        <Route path='/transactions' element={<Transactions />} />
        <Route path='/categories' element={<Categories />} />
      </Routes>
    </Layout>
  );
}

export default MainWrapper;