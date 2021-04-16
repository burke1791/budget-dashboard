import { DatePicker, Layout, Row, Select, Typography } from 'antd';
import 'antd/dist/antd.css';
import React, { Fragment, useState } from 'react';
import moment from 'moment';
import OverviewCards from '../components/overviewCards';

const { Content, Header } = Layout;
const { Title } = Typography;
const { Option } = Select;

function Overview() {

  const [month, setMonth] = useState('');

  const monthSelected = (event, option) => {
    if (event != null) {
      console.log(event.format('DD MMM YYYY'));
      console.log(option);
    }
    
    // setMonth(event.value);
  }

  return (
    <Fragment>
      <Row justify='center'>
        <Header style={{ background: 'none', textAlign: 'center', height: 48 }}>
          <Title
            level={1}
            ellipsis={{ rows: 1 }}
            style={{ margin: 0, fontSize: '32px', fontWeight: 500 }}
          >
            Overview
          </Title>
        </Header>
      </Row>
      <Row justify='center'>
        <DatePicker
          defaultValue={moment('2021-02')}
          format='MMMM YYYY'
          onChange={monthSelected}
          picker='month'
          style={{ width: 200 }}
        />
      </Row>
      <OverviewCards />
    </Fragment>
  )
}

export default Overview;