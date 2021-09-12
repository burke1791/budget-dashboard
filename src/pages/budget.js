import { Card, Col, DatePicker, Layout, Menu, Row, Select, Statistic, Typography } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import React, { Fragment, useEffect, useState } from 'react';
import moment from 'moment';
import OverviewCards from '../components/overviewCards';
import useData from '../hooks/useData';
import { parseCashFlow } from '../utilities/apiHelper';
import { ENDPOINTS } from '../utilities/constants';

const { Content, Header } = Layout;
const { Title } = Typography;
const { Option } = Select;

function Budget() {

  const [month, setMonth] = useState('');
  const [cashFlowArr] = useData({ endpoint: ENDPOINTS.GET_CASHFLOW, method: 'GET', processData: parseCashFlow });
  const [cashFlowIn, setCashFlowIn] = useState(0);
  const [cashFlowOut, setCashFlowOut] = useState(0);

  useEffect(() => {
    if (cashFlowArr && cashFlowArr.length > 0) {
      let [cashIn, cashOut] = findCashFlow(moment().format('YYYY-MM'));

      setCashFlows({ cashFlowIn: cashIn, cashFlowOut: cashOut });
    }
  }, [cashFlowArr]);

  const monthSelected = (event, option) => {
    if (event != null) {
      setMonth(option);

      let [cashIn, cashOut] = findCashFlow(option);
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
              defaultPickerValue={moment()}
              defaultValue={moment()}
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

      <OverviewCards />
    </Fragment>
  )
}

export default Budget;