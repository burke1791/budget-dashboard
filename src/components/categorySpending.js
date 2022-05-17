import React, { useState, useEffect } from 'react';
import { Table, Typography } from 'antd';
import useData from '../hooks/useData';
import { ENDPOINTS } from '../utilities/constants';
import { parseCategorySpending } from '../utilities/apiHelper';
import { formatMoney } from '../utilities/formatter';

const { Text } = Typography;
const { Column } = Table;

function CategorySpending(props) {

  const [loading, setLoading] = useState(true);
  const [categorySpending, categorySpendingFetchDate] = useData({ endpoint: `${ENDPOINTS.CATEGORY_SPENDING}/${props.month}`, method: 'GET', processData: parseCategorySpending, conditions: [props.month] });

  useEffect(() => {
    setLoading(true);
  }, [props.month]);

  useEffect(() => {
    console.log(categorySpending);
    if (categorySpending != undefined) {
      setLoading(false);
    }
  }, [categorySpendingFetchDate]);

  const generateCategoriesForCategoryGroup = (record, index, indent, expanded) => {
    return (
      <NestedCategoryTable categorySpending={record} />
    );
  }

  return (
    <Table
      bordered
      pagination={false}
      dataSource={categorySpending}
      loading={loading}
      size='small'
      expandable={{
        defaultExpandAllRows: true,
        expandedRowRender: generateCategoriesForCategoryGroup
      }}
      rowKey='categoryGroupId'
    >
      <Column
        // colSpan={9}
        dataIndex='categoryGroupName'
        title='Category'
        render={(text) => {
          return (
            <Text strong>{text}</Text>
          )
        }}
      />
      <Column
        // colSpan={5}
        dataIndex='spent'
        title='Spent'
        render={(text) => {
          return (
            <Text strong>{formatMoney(text)}</Text>
          )
        }}
      />
      <Column
        // colSpan={5}
        title='Budgeted Amount'
      />
    </Table>
  );
}

export default CategorySpending;


function NestedCategoryTable(props) {

  return (
    <Table
      bordered
      pagination={false}
      dataSource={props.categorySpending.subCategories}
      size='small'
      rowKey='categoryId'
    >
      <Column
        dataIndex='categoryName'
      />
      <Column
        dataIndex='spent'
        render={(text) => formatMoney(text)}
      />
      <Column
        dataIndex='target'
        key='targetId'
      />
    </Table>
  );
}