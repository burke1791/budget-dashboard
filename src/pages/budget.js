import { Badge, Col, DatePicker, Layout, Row, Statistic } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import React, { Fragment, useEffect, useState } from 'react';
import moment from 'moment';
import { useBudgetState } from '../context/budgetContext';
import CategorySpending from '../components/categorySpending';

const { Content, Header } = Layout;

function Budget() {

  const [month, setMonth] = useState('');
  const [cashFlowIn, setCashFlowIn] = useState(0);
  const [cashFlowOut, setCashFlowOut] = useState(0);

  const { cashFlowArr, cashFlowArr_trigger } = useBudgetState();

  useEffect(() => {
    if (cashFlowArr && cashFlowArr.length > 0) {
      let [cashIn, cashOut] = findCashFlow(moment().format('YYYY-MM'));

      setCashFlows({ cashFlowIn: cashIn, cashFlowOut: cashOut });
    }
  }, [cashFlowArr_trigger]);

  const monthSelected = (event) => {
    if (event != null) {
      let monthString = event.format('YYYY-MM');
      setMonth(monthString);

      let [cashIn, cashOut] = findCashFlow(monthString);
      setCashFlows({ cashFlowIn: cashIn, cashFlowOut: cashOut });
    }
  }

  const findCashFlow = (month) => {
    let cashIn = cashFlowArr.find(cashFlow => cashFlow.month.format('YYYY-MM') === month)?.cashFlowIn || 0;
    let cashOut = cashFlowArr.find(cashFlow => cashFlow.month.format('YYYY-MM') === month)?.cashFlowOut || 0;

    return [cashIn, cashOut];
  }

  const setCashFlows = ({ cashFlowIn, cashFlowOut }) => {
    setCashFlowIn(cashFlowIn);
    setCashFlowOut(cashFlowOut);
  }

  return (
    <Fragment>
      <Header style={{ background: '#001528', padding: 0 }}>
        <Row wrap={false}>
          <Col flex='none'>
            <DatePicker
              picker='month'
              format='MMM YYYY'
              defaultPickerValue={moment()}
              defaultValue={moment()}
              monthCellRender={(current) => {
                let unassignedCount = cashFlowArr.find(cashFlow => cashFlow.month.format('YYYY-MM') === current.format('YYYY-MM'))?.unassignedTransactions || 0;

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
          <Col flex='auto'>
            <Statistic
              value={cashFlowIn}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              prefix='$'
              suffix={<ArrowUpOutlined />}
              style={{ marginTop: 13, marginRight: 8, textAlign: 'right' }}
            />
          </Col>
          <Col flex='auto'>
            <Statistic
              value={cashFlowOut}
              precision={2}
              valueStyle={{ color: '#cf1322' }}
              prefix='$'
              suffix={<ArrowDownOutlined />}
              style={{ marginTop: 13, marginLeft: 8, textAlign: 'left' }}
            />
          </Col>
        </Row>    
      </Header>

      <Content>
        <CategorySpending month={month} />
      </Content>
    </Fragment>
  )
}

export default Budget;