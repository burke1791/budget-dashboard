import { Layout, Row, Col, DatePicker, Badge } from 'antd';
import moment from 'moment';
import React, { Fragment } from 'react';
import TransactionsTable from '../components/transactionsTable';
import { useBudgetDispatch, useBudgetState } from '../context/budgetContext';
import './styles/transactions.css';

const { Content, Header } = Layout;

function Transactions(props) {
  
  const { cashFlowArr, budgetMonth } = useBudgetState();
  const budgetDispatch = useBudgetDispatch();

  const monthSelected = (event) => {
    if (event != null) {
      let monthString = event.format('YYYY-MM');
      budgetDispatch({ type: 'update', key: 'budgetMonth', value: monthString });
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
              defaultPickerValue={moment(budgetMonth)}
              defaultValue={moment(budgetMonth)}
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
            <TransactionsTable month={budgetMonth} />
          </Col>
        </Row>
      </Content>
    </Fragment>
  );
}

export default Transactions;