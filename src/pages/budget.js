import { Col, DatePicker, Layout, Menu, Row, Select, Statistic, Typography } from 'antd';
import { ArrowUpOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import React, { Fragment, useState } from 'react';
import moment from 'moment';
import OverviewCards from '../components/overviewCards';

const { Content, Header } = Layout;
const { Title } = Typography;
const { Option } = Select;

function Budget() {

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
      <Row>
        <Menu theme='dark' mode='horizontal'>
          <Menu.Item>
            {/* Month picker - float left */}
            <DatePicker picker='month' style={{ marginLeft: 8 }} />
          </Menu.Item>
          <Menu.Item>
            {/* cash flow - center */}
            <Statistic
              title='Cash Flow In'
              value={11.28}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              prefix={<ArrowUpOutlined />}
              suffix='%'
              style={{ alignSelf: 'center', width: 'unset' }}
            />
          </Menu.Item>
        </Menu>
      </Row>

      <OverviewCards />
    </Fragment>
  )
}

export default Budget;