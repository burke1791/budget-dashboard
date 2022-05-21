import React, { useState, useEffect } from 'react';
import useData from '../../hooks/useData';
import { Table, Checkbox } from 'antd';
import { ENDPOINTS } from '../../utilities/constants';
import moment from 'moment';
import { formatMoney } from '../../utilities/formatter';

const { Column } = Table;

function SimilarTransactions(props) {

  const [loading, setLoading] = useState(true);
  const [similarTransactions, similarTransactionsFetchDate] = useData({ 
    endpoint: `${ENDPOINTS.SIMILAR_TRANSACTIONS}/${props.transactionId}`,
    method: 'GET',
    conditions: [props.transactionId]
  });

  useEffect(() => {
    if (similarTransactionsFetchDate != undefined) {
      setLoading(false);
    }
  }, [similarTransactionsFetchDate]);

  useEffect(() => {
    setLoading(true);
  }, [props.transactionId]);

  const similarTransactionCheckboxChanged = (transactionId, checkedEvent) => {
    const included = checkedEvent.target.checked;
    props.updateIncluded(transactionId, included);
  }

  const generateIncludeColumn = () => {
    if (props.showIncludeColumn) {
      return (
        <Column
          title='Include?'
          render={(value, record) => {
            return (
              <Checkbox onChange={(event) => similarTransactionCheckboxChanged(record.transactionId, event)} />
            );
          }}
        />
      );
    }

    return null;
  }
  
  return (
    <Table
      dataSource={similarTransactions}
      loading={loading}
      pagination={false}
      size='small'
      bordered
      rowKey='transactionId'
    >
      <Column
        dataIndex='transactionDate'
        title='Date'
        render={(value) => moment(value).format('YYYY-MM-DD')}
      />
      <Column
        dataIndex='description'
        title='Description'
      />
      <Column
        dataIndex='accountName'
        title='Account'
      />
      <Column
        dataIndex='amount'
        title='Amount'
        render={(value) => formatMoney(value)}
      />
      {generateIncludeColumn()}
    </Table>
  );
}

export default SimilarTransactions;