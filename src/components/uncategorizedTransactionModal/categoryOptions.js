import React, { Fragment } from 'react';
import { Typography, Select } from 'antd';
import { useBudgetState } from '../../context/budgetContext';

const { Text } = Typography;
const { Option } = Select;

function CategoryOptions(props) {

  const { budgetCategories } = useBudgetState();

  const generateCategoriesList = () => {
    return budgetCategories.map(cat => {
      return <Option key={cat.categoryId} value={cat.categoryId}>{cat.categoryGroupName} | {cat.categoryName}</Option>
    });
  }

  const categorySelected = (selectedCategoryId) => {
    props.categorySelected(selectedCategoryId);
  }

  return (
    <Fragment>
      <Text strong>Category</Text>
      <Select
        showSearch
        placeholder='Select a category'
        optionFilterProp='children'
        style={{ width: '100%', marginTop: 6, marginBottom: 6 }}
        onSelect={categorySelected}
      >
        {generateCategoriesList()}
      </Select>
    </Fragment>
  );
}

export default CategoryOptions;