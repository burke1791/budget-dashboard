import React, { useState, useEffect } from 'react';
import { Select, Form, Input, Button } from 'antd';
import { useBudgetState, useBudgetDispatch } from '../../context/budgetContext';
import { useData2 } from '../../hooks';
import { ENDPOINTS } from '../../utilities/constants';

const { Option } = Select;

function NewMerchant(props) {

  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();

  const [newMerchantRecord, newMerchantFetchDate, createNewMerchant] = useData2({
    endpoint: ENDPOINTS.MERCHANTS,
    method: 'POST'
  });

  const { budgetCategories, merchantFetchDate } = useBudgetState();
  const budgetDispatch = useBudgetDispatch();

  useEffect(() => {
    console.log(newMerchantRecord);
    if (newMerchantFetchDate != undefined) {
      budgetDispatch({ type: 'update', key: 'merchantsRefreshTrigger', value: new Date() });
      form.resetFields();
      props.dismiss();
    }
  }, [newMerchantFetchDate]);

  useEffect(() => {
    if (merchantFetchDate != undefined) {
      setLoading(false);
    }
  }, [merchantFetchDate]);

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 }
  }

  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };

  const onFinish = (values) => {
    setLoading(true);
    createNewMerchant({ merchantName: values.merchantName, defaultCategoryId: values.defaultCategoryId });
  };

  const generateCategoryOptions = () => {
    if (budgetCategories.length) {
      return budgetCategories.map(cat => {
        return <Option key={cat.categoryId} value={cat.categoryId}>{cat.categoryGroupName} | {cat.categoryName}</Option>
      });
    }

    return null;
  }

  return (
    <Form {...layout} form={form} name='new-merchant' onFinish={onFinish}>
      <Form.Item name='merchantName' label='Merchant Name' rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name='defaultCategoryId' label='Default Category' rules={[{ required: true }]}>
        <Select
          placeholder='Select a default category'
          allowClear
          showSearch
          optionFilterProp='children'
        >
          {generateCategoryOptions()}
        </Select>
      </Form.Item>
      <Form.Item {...tailLayout}>
        <Button type='primary' htmlType='submit' loading={loading}>
          Create New Merchant
        </Button>
      </Form.Item>
    </Form>
  );
}

export default NewMerchant;