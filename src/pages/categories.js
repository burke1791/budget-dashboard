import React, { Fragment } from 'react';
import { Layout, Row, Table, List, Typography } from 'antd';
import 'antd/dist/antd.css';
import { useBudgetState } from '../context/budgetContext';

const { Header } = Layout;
const { Title } = Typography;
const { Column } = Table;

function Categories() {

  const { budgetCategories } = useBudgetState();

  const parseBudgetCategories = () => {
    let categoryGroups = [];
    let processedGroups = [];

    budgetCategories.forEach(category => {
      let groupId = category.categoryGroupId;
      let groupName = category.categoryGroupName;

      let cat = {
        categoryId: category.categoryId,
        categoryName: category.categoryName
      };

      if (processedGroups.find(groupNum => { return groupNum == groupId})) {
        // if we've already parsed the categoryGroup, add this category to the list
        categoryGroups.find(group => group.groupId == groupId).categories.push(cat);
      } else {
        // new categoryGroup
        let group = {
          groupId: groupId,
          groupName: groupName,
          displayOrder: category.displayOrder,
          categories: [cat]
        };

        categoryGroups.push(group);
        processedGroups.push(groupId);
      }
    });

    return categoryGroups;
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
            Budget Categories
          </Title>
        </Header>
      </Row>
      <Row justify='center'>
        <Table
          dataSource={parseBudgetCategories()}
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