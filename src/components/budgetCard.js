import React, { useEffect, useState } from 'react';
import { Card, Statistic } from 'antd';
import 'antd/dist/antd.css';

function BudgetCard(props) {

  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState(null);

  useEffect(() => {
    fetchData();
  }, [props.dataPoint]);

  const fetchData = () => {
    
  }

  return (
    <Card
      loading={loading}
      style={{ textAlign: 'center' }}
      bodyStyle={{ padding: '24px 12px' }}
    >
      <Statistic title={props.title} value={value} />
    </Card>
  );
}

export default BudgetCard;