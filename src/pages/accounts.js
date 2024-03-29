import React, { Fragment } from 'react';
import { Row, Layout, Typography, Table } from 'antd';
import 'antd/dist/antd.css';
import { useBudgetState } from '../context/budgetContext';

const { Header } = Layout;
const { Title } = Typography;

function Accounts(props) {

  const { accounts } = useBudgetState();

  return (
    <Fragment>
      <Row justify='center'>
        <Header style={{ background: 'none', textAlign: 'center', height: 48 }}>
          <Title
            level={1}
            ellipsis={{ rows: 1 }}
            style={{ margin: 0, fontSize: '32px', fontWeight: 500 }}
          >
            Accounts
          </Title>
        </Header>
      </Row>
      <Row justify='center'>
        <Table
          columns={accountColumns}
          dataSource={accounts}
          rowKey='accountId'
          size='small'
          pagination={false}
        />
      </Row>
    </Fragment>
  )
}

const accountColumns = [
  {
    title: 'Account Name',
    dataIndex: 'accountName',
    width: 300
  },
  {
    title: 'Account Type',
    dataIndex: 'accountType',
    width: 250
  }
];

export default Accounts;