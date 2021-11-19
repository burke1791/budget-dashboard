import React, { useState, useEffect, Fragment } from 'react';
import { Table } from 'antd';
import UncategorizedTransactionModal from './uncategorizedTransactionModal';
import moment from 'moment';
import { formatMoney } from '../utilities/formatter';
import useData from '../hooks/useData';
import { ENDPOINTS } from '../utilities/constants';

const { Column } = Table;

function TransactionsTable(props) {

  const [selectedTransaction, setSelectedTransaction] = useState({});
  const [transactionTrigger, setTransactionTrigger] = useState(null);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const [transactions, transactionsFetchDate] = useData({
    endpoint: `${ENDPOINTS.FULL_TRANSACTIONS_BY_MONTH}/${props.month}`,
    method: 'GET',
    refreshTrigger: transactionTrigger,
    conditions: [props.month]
  });

  useEffect(() => {
    if (props.month != undefined) {
      setTransactionsLoading(true);
      setTransactionTrigger(new Date());
    }
  }, [props.month]);

  useEffect(() => {
    if (transactionsFetchDate != undefined) {
      setTransactionsLoading(false);
    }
  }, [transactionsFetchDate]);

  const getRowClass = (record) => {
    if (record.isUncategorized) return 'tx-uncategorized row-clickable';

    return 'row-clickable';
  }
  
  const transactionClick = (transaction) => {
    setSelectedTransaction(transaction);
    setModalVisible(true);
  }

  const dismissModal = () => {
    setSelectedTransaction({});
    setModalVisible(false);
  }
  
  return (
    <Fragment>
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
      <UncategorizedTransactionModal
        visible={modalVisible}
        dismiss={dismissModal}
        uncategorizedTransaction={selectedTransaction}
      />
    </Fragment>
  )
}

export default TransactionsTable;