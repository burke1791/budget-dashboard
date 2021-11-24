import { Col, Divider, Input, Select, Modal, Row, Table, Typography, Button, Radio, Checkbox, Form } from 'antd';
import moment from 'moment';
import React, { Fragment, useState } from 'react';
import { useEffect } from 'react/cjs/react.development';
import { useBudgetDispatch, useBudgetState } from '../context/budgetContext';
import useData from '../hooks/useData';
import { ENDPOINTS, TRANSACTION_CATEGORIZATION_TYPE } from '../utilities/constants';
import { formatMoney } from '../utilities/formatter';

const { Column } = Table;
const { Option } = Select;
const { Text } = Typography;

function UncategorizedTransactionModal(props) {

  const handleCancel = () => {
    props.dismiss();
  }

  return (
    <Modal
      title='Categorize Transaction'
      visible={props.visible}
      onCancel={handleCancel}
      style={{ minWidth: '60%', maxWidth: '80%' }}
      footer={null}
    >
      <UncategorizedTransactionAction uncategorizedTransaction={[props.uncategorizedTransaction]} />
    </Modal>
  );
}

function UncategorizedTransactionAction(props) {

  const [transactionUpdateType, setTransactionUpdateType] = useState(TRANSACTION_CATEGORIZATION_TYPE.MERCHANT);
  const [categoryId, setCategoryId] = useState(null);
  const [merchantId, setMerchantId] = useState(null);
  const [thisAccountOnly, setThisAccountOnly] = useState(false);
  const [similarTransactionsLoading, setSimilarTransactionsLoading] = useState(true);
  const [categorizeLoading, setCategorizeLoading] = useState(false);

  const transactionUpdateTypeSelected = ({ target: { value }}) => {
    setTransactionUpdateType(value);
  }

  const categorySelected = (categoryId) => {
    setCategoryId(categoryId);
  }

  const merchantSelected = (merchantId) => {
    setMerchantId(merchantId);
  }

  const thisAccountOnlyChanged = ({ target: { checked }}) => {
    console.log(checked);
    setThisAccountOnly(checked);
  }

  const renderOptions = () => {
    if (transactionUpdateType == TRANSACTION_CATEGORIZATION_TYPE.MERCHANT) {
      return <MerchantOptions merchantSelected={merchantSelected} />;
    } else if (transactionUpdateType == TRANSACTION_CATEGORIZATION_TYPE.USER_SELECTED_CATEGORY) {
      return <CategoryOptions categorySelected={categorySelected} />;
    }
  }

  const renderAccountOnlyCheckbox = () => {
    if (transactionUpdateType == TRANSACTION_CATEGORIZATION_TYPE.MERCHANT) {
      return <ThisAccountOnlyCheckbox checked={thisAccountOnly} thisAccountOnlyChanged={thisAccountOnlyChanged} />
    }

    return null;
  }

  const categorizeTransaction = () => {

  }

  return (
    <Fragment>
      <Row justify='center'>
        <Radio.Group onChange={transactionUpdateTypeSelected} value={transactionUpdateType}>
          <Radio value={TRANSACTION_CATEGORIZATION_TYPE.MERCHANT}>Merchant</Radio>
          <Radio value={TRANSACTION_CATEGORIZATION_TYPE.USER_SELECTED_CATEGORY}>One-Time Category</Radio>
        </Radio.Group>
      </Row>
      <TransactionSearchTextInput transactionUpdateType={transactionUpdateType} />
      <Row justify='center'>
        <Col lg={24} xl={18}>
          {renderOptions()}
        </Col>
      </Row>
      {renderAccountOnlyCheckbox()}
      <Row justify='center'>
        <Button
          size='small'
          type='primary'
          onClick={categorizeTransaction}
          loading={categorizeLoading}
          style={{ marginTop: 6 }}
        >
          Categorize Transaction
        </Button>
      </Row>
      <Row justify='center'>
        <Col span={24}>
          <Table
            dataSource={props?.uncategorizedTransaction || []}
            pagination={false}
            size='small'
            bordered
            rowKey='transactionId'
            style={{ marginTop: 12 }}
          >
            <Column
              dataIndex='transactionDate'
              title='Date'
              render={(value) => moment(value).format('YYYY-MM-DD')}
            />
            <Column
              dataIndex='description'
              title='Description'
            />
            <Column
              dataIndex='accountName'
              title='Account'
            />
            <Column
              dataIndex='amount'
              title='Amount'
              render={(value) => formatMoney(value)}
            />
          </Table>
        </Col>
      </Row>
      <Divider orientation='left'>Similar Transactions</Divider>
      {/* Table listing similar transactions */}
      <Row justify='center'>
        <Col span={24}>
          <SimilarTransactions transactionId={props?.uncategorizedTransaction[0].transactionId || 0} />
        </Col>
      </Row>
    </Fragment>
  )
}

function SimilarTransactions(props) {

  const [loading, setLoading] = useState(true);
  const [similarTransactions, similarTransactionsFetchDate] = useData({ 
    endpoint: `${ENDPOINTS.SIMILAR_TRANSACTIONS}/${props.transactionId}`,
    method: 'GET',
    conditions: [props.transactionId]
  });

  useEffect(() => {
    if (similarTransactionsFetchDate != undefined) {
      setLoading(false);
    }
  }, [similarTransactionsFetchDate]);

  useEffect(() => {
    setLoading(true);
  }, [props.transactionId])
  
  return (
    <Table
      dataSource={similarTransactions}
      loading={loading}
      pagination={false}
      size='small'
      bordered
      rowKey='transactionId'
    >
      <Column
        dataIndex='transactionDate'
        title='Date'
        render={(value) => moment(value).format('YYYY-MM-DD')}
      />
      <Column
        dataIndex='description'
        title='Description'
      />
      <Column
        dataIndex='accountName'
        title='Account'
      />
      <Column
        dataIndex='amount'
        title='Amount'
        render={(value) => formatMoney(value)}
      />
    </Table>
  );
}

function TransactionSearchTextInput(props) {

  const [searchText, setSearchText] = useState('');

  const textChange = ({ target: { value }}) => {
    setSearchText(value);
  }

  if (props.transactionUpdateType == TRANSACTION_CATEGORIZATION_TYPE.MERCHANT) {
    return (
      <Row justify='center'>
        <Col lg={24} xl={18}>
          <Text strong>Search String</Text>
          <Input
            placeholder='Identifier'
            value={searchText}
            onChange={textChange}
            style={{ marginTop: 6, marginBottom: 6 }}
          />
        </Col>
      </Row>
    );
  }

  return null;
}

function MerchantOptions(props) {

  const [newMerchantModalVisible, setNewMerchantModalVisible] = useState(false);

  const { merchants } = useBudgetState();

  const generateMerchantsList = () => {
    return merchants.map(merchant => {
      return <Option key={merchant.merchantId} value={merchant.merchantId}>{merchant.merchantName}</Option>
    });
  }

  const merchantSelected = (selectedMerchantId) => {
    props.merchantSelected(selectedMerchantId);
  }

  const newMerchantClicked = () => {
    setNewMerchantModalVisible(true);
  }

  const dismissNewMerchantModal = () => {
    setNewMerchantModalVisible(false);
  }

  return (
    <Fragment>
      <Text strong>Merchant</Text>
      <Row justify='space-between' align='middle'>
        <Col span={16}>
          <Select
            showSearch
            placeholder='Select a merchant'
            optionFilterProp='children'
            style={{ width: '100%', marginTop: 6, marginBottom: 6 }}
            onSelect={merchantSelected}
          >
            {generateMerchantsList()}
          </Select>
        </Col>
        <Col span={6}>
          <Button
            size='small'
            type='primary'
            onClick={newMerchantClicked}
            style={{ width: '100%', height: 30 }}
          >
            New Merchant
          </Button>
        </Col>
      </Row>
      <NewMerchantModal visible={newMerchantModalVisible} dismiss={dismissNewMerchantModal} />
    </Fragment>
  )
}

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

function ThisAccountOnlyCheckbox(props) {

  return (
    <Row justify='center'>
      <Checkbox checked={props.checked} onChange={props.thisAccountOnlyChanged}>This Account Only</Checkbox>
    </Row>
  );
}

function NewMerchantModal(props) {

  const handleCancel = () => {
    props.dismiss();
  }

  return (
    <Modal
      title='New Merchant'
      visible={props.visible}
      onCancel={handleCancel}
      style={{ minWidth: '40%', maxWidth: '60%' }}
      footer={null}
    >
      <NewMerchant dismiss={handleCancel} />
    </Modal>
  )
}

function NewMerchant(props) {

  const [loading, setLoading] = useState(false);
  const [newMerchantObject, setNewMerchantObject] = useState({});

  const [form] = Form.useForm();

  const [newMerchantRecord, newMerchantFetchDate] = useData({
    endpoint: ENDPOINTS.MERCHANTS,
    method: 'POST',
    payload: newMerchantObject,
    conditions: [newMerchantObject.defaultCategoryId != undefined]
  });

  const { budgetCategories, merchantFetchDate } = useBudgetState();
  const budgetDispatch = useBudgetDispatch();

  useEffect(() => {
    if (newMerchantFetchDate != undefined) {
      budgetDispatch({ type: 'update', key: 'merchantsRefreshTrigger', value: new Date() });
    }
  }, [newMerchantFetchDate]);

  useEffect(() => {
    if (merchantFetchDate != undefined) {
      setLoading(false);
      props.dismiss();
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
    setNewMerchantObject({ merchantName: values.merchantName, defaultCategoryId: values.defaultCategoryId });
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

export default UncategorizedTransactionModal;