import { Layout, Row, Col, DatePicker, Badge } from 'antd';
import moment from 'moment';
import React, { Fragment, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import TransactionsTable from '../components/transactionsTable';
import { useBudgetState } from '../context/budgetContext';
import './styles/transactions.css';

const { Content, Header } = Layout;

function Transactions(props) {
  
  const { cashFlowArr } = useBudgetState();
  const [searchParams, setSearchParams] = useSearchParams();
  const [month, setMonth] = useState('');

  useEffect(() => {
    const searchMonth = searchParams.get('month');

    if (searchMonth == undefined) {
      setSearchParams({ month: moment().format('YYYY-MM') });
    } else {
      setMonth(searchParams.get('month'));
    }
  }, [searchParams.get('month')]);

  const monthSelected = (event) => {
    if (event != null) {
      const monthString = event.format('YYYY-MM');
      setSearchParams({ month: monthString });
    }
  }
  
  return (
    <Fragment>
      <Header style={{ background: '#001528', padding: 0 }}>
        <Row wrap={false}>
          <Col>
            <DatePicker
              picker='month'
              format='MMM YYYY'
              value={moment(month)}
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
            <TransactionsTable month={month} />
          </Col>
        </Row>
      </Content>
    </Fragment>
  );
}

export default Transactions;