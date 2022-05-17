import React, { useState, useEffect } from 'react';
import { Badge, Layout, Menu, Typography } from 'antd';
import 'antd/dist/antd.css'
import useData from '../hooks/useData';
import { ENDPOINTS } from '../utilities/constants';
import { calculateTotalUnassignedTransactions } from '../utilities/apiHelper';
import { useBudgetState } from '../context/budgetContext';
import { useLocation, useNavigate } from 'react-router-dom';

const { Sider } = Layout;
const { Text } = Typography;

function Sidenav(props) {

  const [selectedItem, setSelectedItem] = useState('');

  const { budgetMonth } = useBudgetState();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setSelectedItem(location.pathname);
  }, [location.pathname]);

  const [unassignedTransactionCount, unassignedTransactionCountFetchDate] = useData({
    endpoint: ENDPOINTS.UNASSIGNED_TRANSACTION_COUNTS,
    method: 'GET',
    processData: calculateTotalUnassignedTransactions
  });

  const handleNav = (event) => {
    navigate(event.key);
  }

  const textColorStyle = (itemKey) => {
    if (itemKey === selectedItem) return { color: 'rgb(255, 255, 255)' };

    return { color: 'rgba(255, 255, 255, 0.65)' };
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
      <Menu theme='dark' mode='inline' selectedKeys={[selectedItem]} onClick={handleNav}>
        <Menu.Item key='/dashboard'>
          Dashboard
        </Menu.Item>
        <Menu.Item key='/budget'>
          Budget
        </Menu.Item>
        <Menu.Item key='/accounts'>
          Accounts
        </Menu.Item>
        <Menu.Item key='/transactions'>
          <Badge count={unassignedTransactionCount} overflowCount={9} offset={[18, 0]} title={`${unassignedTransactionCount} unassigned transactions`}>
            <Text style={textColorStyle('transactions')}>Transactions</Text>
          </Badge>
        </Menu.Item>
        <Menu.Item key='/categories'>
          Categories
        </Menu.Item>
      </Menu>
    </Sider>
  );
}

export default Sidenav;