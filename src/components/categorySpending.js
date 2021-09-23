import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import useData from '../hooks/useData';
import { ENDPOINTS } from '../utilities/constants';

const { Column } = Table;

function CategorySpending(props) {

  const [loading, setLoading] = useState(true);
  const [categorySpending, categorySpendingFetchDate] = useData({ endpoint: `${ENDPOINTS.CATEGORY_SPENDING}/${props.month}`, method: 'GET' });

  useEffect(() => {
    setLoading(true);
  }, [props.month]);

  useEffect(() => {
    if (categorySpending && categorySpending.length > 0) {
      setLoading(false);
    }
  }, [categorySpendingFetchDate]);

  const generateCategoriesForCategoryGroup = (record, index, indent, expanded) => {
    console.log(record);

    return null;

    return (
      <CategorySpending categorySpending={record} />
    );
  }

  return (
    <Table
      bordered
      dataSource={categorySpending}
      loading={loading}
      size='small'
      expandable={{
        defaultExpandAllRows: true,
        expandedRowRender: generateCategoriesForCategoryGroup
      }}
    >
      <Column
        colSpan={9}
        dataIndex='categoryGroupName'
      >
        Category
      </Column>
      <Column
        colSpan={5}
        dataIndex='spent'
      >
        Spent
      </Column>
      <Column
        colSpan={5}
      >
        Budgeted Amount
      </Column>
    </Table>
  );
}

export default CategorySpending;


function NestedCategoryTable(props) {

  const columns = [
    {
      dataIndex: 'categoryname',
    },
    {
      dataIndex: 'spent'
    },
    {
      dataIndex: 'target',
      key: 'targetId'
    }
  ]

  return (
    <Table
      bordered
      columns={columns}
      dataSource={props.categorySpending}
      size='small'
    />
  );
}