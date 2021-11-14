import { Layout, Row, Col, Table, DatePicker, Badge } from 'antd';
import moment from 'moment';
import React, { Fragment, useEffect, useState } from 'react';
import UncategorizedTransactionModal from '../components/uncategorizedTransactionModal';
import { useBudgetDispatch } from '../context/budgetContext';
import useData from '../hooks/useData';
import { ENDPOINTS } from '../utilities/constants';
import { formatMoney } from '../utilities/formatter';
import './styles/transactions.css';

const { Content, Header } = Layout;
const { Column } = Table;

function Transactions(props) {

  const [month, setMonth] = useState('');
  const [transactionTrigger, setTransactionTrigger] = useState(null);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState({});
  const [modalVisible, setModalVisible] = useState(false);

  const [transactions, transactionsFetchDate] = useData({
    endpoint: `${ENDPOINTS.FULL_TRANSACTIONS_BY_MONTH}/${month}`,
    method: 'GET',
    refreshTrigger: transactionTrigger
  });

  const { cashFlowArr } = useBudgetDispatch();

  useEffect(() => {
    if (transactionsFetchDate != undefined) {
      setTransactionsLoading(false);
    }
  }, [transactionsFetchDate]);

  const monthSelected = (event) => {
    if (event != null) {
      let monthString = event.format('YYYY-MM');
      setMonth(monthString);

      setTransactionsLoading(true);
      setTransactionTrigger(new Date());
    }
  }

  const transactionClick = (transaction) => {
    setSelectedTransaction(transaction);
    setModalVisible(true);
  }

  const getRowClass = (record) => {
    if (record.isUncategorized) return 'tx-uncategorized row-clickable';

    return 'row-clickable';
  }

  const dismissModal = () => {
    setSelectedTransaction({});
    setModalVisible(false);
  }
  
  return (
    <Fragment>
      <Header style={{ background: '#001528', padding: 0 }}>
        <Row wrap={false}>
          <Col>
            <DatePicker
              picker='month'
              format='MMM YYYY'
              defaultPickerValue={moment()}
              defaultValue={moment()}
              monthCellRender={(current) => {
                let unassignedCount = cashFlowArr?.find(cashFlow => cashFlow.month.format('YYYY-MM') === current.format('YYYY-MM'))?.unassignedTransactions || 0;

                return (
                  <Badge count={unassignedCount} overflowCount={9} offset={[10, 0]}>
                    {current.format('MMM')}
                  </Badge>
                );
              }}
              onChange={monthSelected}
              style={{ marginLeft: 8, marginTop: 16 }}
            />
          </Col>
        </Row>
      </Header>

      <Content>
        <Row justify='center'>
          <Col span={20}>
            <Table
              bordered
              pagination={false}
              dataSource={transactions}
              loading={transactionsLoading}
              size='small'
              rowKey='transactionId'
              rowClassName={getRowClass}
              onRow={(record) => {
                return {
                  onClick: () => transactionClick(record)
                };
              }}
            >
              <Column
                dataIndex='transactionDate'
                title='Date'
                render={(text) => moment(text).format('YYYY-MM-DD')}
              />
              <Column
                dataIndex='accountName'
                title='Account'
              />
              <Column
                dataIndex='merchantName'
                title='Merchant'
              />
              <Column
                dataIndex='categoryGroupName'
                title='Category Group'
              />
              <Column
                dataIndex='categoryName'
                title='Category'
              />
              <Column
                dataIndex='amount'
                title='Amount'
                render={(text) => formatMoney(text)}
              />
            </Table>
          </Col>
        </Row>
      </Content>
      <UncategorizedTransactionModal
        visible={modalVisible}
        dismiss={dismissModal}
        uncategorizedTransaction={selectedTransaction}
      />
    </Fragment>
  );
}

export default Transactions;