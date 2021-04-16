import React from 'react';
import { Card, Col, Row } from 'antd';
import BudgetCard from './budgetCard';

function OverviewCards() {

  return (
    <Row type='flex' justify='center' gutter={[16, 24]} style={{ width: '100%', overflowX: 'hidden', marginTop: 12 }}>
      <Col xs={0} md={5} xxl={3}>
        <BudgetCard title='Total Income' />
      </Col>
      <Col xs={0} md={5} xxl={3}>
        <BudgetCard title='Total Spent' />
      </Col>
      <Col xs={0} md={5} xxl={3}>
        <BudgetCard title='Total Saved' />
      </Col>
    </Row>
  );
}

export default OverviewCards;