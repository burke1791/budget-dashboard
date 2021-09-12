import React, { Fragment } from 'react';
import { Layout, Row, Table, List, Typography } from 'antd';
import 'antd/dist/antd.css';
import useData from '../hooks/useData';
import { parseCategories } from '../utilities/apiHelper';
import { ENDPOINTS } from '../utilities/constants';

const { Header } = Layout;
const { Title } = Typography;
const { Column } = Table;

function Categories() {

  const [categories] = useData({ endpoint: ENDPOINTS.CATEGORIES, method: 'GET', processData: parseCategories });

  return (
    <Fragment>
      <Row justify='center'>
        <Header style={{ background: 'none', textAlign: 'center', height: 48 }}>
          <Title
            level={1}
            ellipsis={{ rows: 1 }}
            style={{ margin: 0, fontSize: '32px', fontWeight: 500 }}
          >
            Budget Categories
          </Title>
        </Header>
      </Row>
      <Row justify='center'>
        <Table
          dataSource={categories}
          rowKey='groupId'
          size='small'
          pagination={false}
        >
          <Column title='Category Group' dataIndex='groupName' />
          <Column
            title='Categories'
            dataIndex='categories'
            render={(categories) => {
              return (
                <List 
                  bordered
                  dataSource={categories}
                  size='small'
                  rowKey='categoryId'
                  renderItem={(category) => {
                    return (
                      <List.Item key={category.categoryId}>{category.categoryName}</List.Item>
                    )
                  }}
                />
              )
            }}
          />
        </Table>
      </Row>
    </Fragment>
  )
}

export default Categories;