import { Col, Divider, Input, Select, Modal, Row, Table, Typography, Button, Radio, Checkbox, Form, message } from 'antd';
import moment from 'moment';
import React, { Fragment, useRef, useState } from 'react';
import { useEffect } from 'react/cjs/react.development';
import { useBudgetDispatch, useBudgetState } from '../context/budgetContext';
import useApi from '../hooks/useApi';
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
      <UncategorizedTransactionAction
        uncategorizedTransaction={[props.uncategorizedTransaction]}
        triggerTransactionsDownload={props.triggerTransactionsDownload}
        dismiss={handleCancel}
      />
    </Modal>
  );
}

function UncategorizedTransactionAction(props) {

  const similarTransactionsIncluded = useRef({});
  const [updateTransactionRes, updateTransactionReturnDate, updateTransaction] = useApi({
    endpoint: ENDPOINTS.TRANSACTION_CATEGORIZE,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  const [merchantSearchRes, merchantSearchReturnDate, addNewMerchantSearchString] = useApi({
    endpoint: ENDPOINTS.MERCHANT_SEARCH_STRING,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });

  const [transactionUpdateType, setTransactionUpdateType] = useState(TRANSACTION_CATEGORIZATION_TYPE.MERCHANT);
  const [categoryId, setCategoryId] = useState(null);
  const [merchantId, setMerchantId] = useState(null);
  const [merchantSearchText, setMerchantSearchText] = useState(null);
  const [merchantNotLikeText, setMerchantNotLikeText] = useState(null);
  const [thisAccountOnly, setThisAccountOnly] = useState(false);
  const [similarTransactionsLoading, setSimilarTransactionsLoading] = useState(true);
  const [categorizeLoading, setCategorizeLoading] = useState(false);

  useEffect(() => {
    if (merchantSearchReturnDate) {
      const count = merchantSearchRes.data[0].count;
      message.success(`${count} transactions categorized`);

      // trigger re-download of transactions and dismiss modal
      props.triggerTransactionsDownload();
      setCategorizeLoading(false);
      props.dismiss();
    }
  }, [merchantSearchReturnDate]);

  useEffect(() => {
    if (updateTransactionReturnDate) {
      const count = updateTransactionRes.data[0].count;
      message.success(`${count} transactions categorized`);

      // trigger re-download of transactions and dismiss modal
      props.triggerTransactionsDownload();
      setCategorizeLoading(false);
      props.dismiss();
    }
  }, [updateTransactionReturnDate]);

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

  const updateIncludedTransactions = (transactionId, included) => {
    similarTransactionsIncluded.current[transactionId] = included;
  }

  const constructSimilarTransactionIdString = () => {
    let included = '';
    let count = 0;

    Object.keys(similarTransactionsIncluded.current).forEach(id => {
      if (similarTransactionsIncluded.current[id]) {
        if (count == 0) {
          included += `${id}`;
        } else {
          included += `,${id}`;
        }

        count++;
      }
    });

    return included;
  }

  const generateSubmitButton = () => {
    if (transactionUpdateType == TRANSACTION_CATEGORIZATION_TYPE.MERCHANT) {
      return (
        <Button
          size='small'
          type='primary'
          onClick={setMerchantSearch}
          loading={categorizeLoading}
          style={{ marginTop: 6 }}
        >
          Set Merchant Search
        </Button>
      )
    } else if (transactionUpdateType == TRANSACTION_CATEGORIZATION_TYPE.USER_SELECTED_CATEGORY) {
      return (
        <Button
          size='small'
          type='primary'
          onClick={categorizeTransaction}
          loading={categorizeLoading}
          style={{ marginTop: 6 }}
        >
          Categorize Transaction
        </Button>
      );
    }

    return null;
  }

  const setMerchantSearch = () => {
    const payload = {
      MerchantId: merchantId,
      SearchString: merchantSearchText,
      NotLike: merchantNotLikeText,
      AccountId: thisAccountOnly ? props?.uncategorizedTransaction[0].accountId : null
    };

    setCategorizeLoading(true);

    // send POST request
    addNewMerchantSearchString(payload);
  }

  const categorizeTransaction = () => {
    const transactionId = props?.uncategorizedTransaction[0].transactionId;
    const included = constructSimilarTransactionIdString();

    const payload = {
      TransactionId: transactionId,
      CategoryId: categoryId,
      IncludedTransactions: included
    };

    console.log(payload);

    setCategorizeLoading(true);

    // send POST request
    updateTransaction(payload);
  }

  return (
    <Fragment>
      <Row justify='center'>
        <Radio.Group onChange={transactionUpdateTypeSelected} value={transactionUpdateType}>
          <Radio value={TRANSACTION_CATEGORIZATION_TYPE.MERCHANT}>Merchant</Radio>
          <Radio value={TRANSACTION_CATEGORIZATION_TYPE.USER_SELECTED_CATEGORY}>One-Time Category</Radio>
        </Radio.Group>
      </Row>
      <TransactionSearchTextInput transactionUpdateType={transactionUpdateType} setSearchText={setMerchantSearchText} setNotLikeText={setMerchantNotLikeText} />
      <Row justify='center'>
        <Col lg={24} xl={18}>
          {renderOptions()}
        </Col>
      </Row>
      {renderAccountOnlyCheckbox()}
      <Row justify='center'>
        {generateSubmitButton()}
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
          <SimilarTransactions
            transactionId={props?.uncategorizedTransaction[0].transactionId || 0}
            updateIncluded={updateIncludedTransactions}
            showIncludeColumn={transactionUpdateType == TRANSACTION_CATEGORIZATION_TYPE.USER_SELECTED_CATEGORY}
          />
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
  }, [props.transactionId]);

  const similarTransactionCheckboxChanged = (transactionId, checkedEvent) => {
    const included = checkedEvent.target.checked;
    props.updateIncluded(transactionId, included);
  }

  const generateIncludeColumn = () => {
    if (props.showIncludeColumn) {
      return (
        <Column
          title='Include?'
          render={(value, record) => {
            return (
              <Checkbox onChange={(event) => similarTransactionCheckboxChanged(record.transactionId, event)} />
            );
          }}
        />
      );
    }

    return null;
  }
  
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
      {generateIncludeColumn()}
    </Table>
  );
}

function TransactionSearchTextInput(props) {

  const textChange = ({ target: { value }}) => {
    props.setSearchText(value);
  }

  const notLikeChange = ({ target: { value }}) => {
    props.setNotLikeText(value);
  }

  if (props.transactionUpdateType == TRANSACTION_CATEGORIZATION_TYPE.MERCHANT) {
    return (
      <Fragment>
        <Row justify='center'>
          <Col lg={24} xl={18}>
            <Text strong>Search String</Text>
            <Input
              placeholder='Search string'
              onChange={textChange}
              style={{ marginTop: 6, marginBottom: 6 }}
            />
          </Col>
        </Row>
        <Row justify='center'>
          <Col lg={24} xl={18}>
            <Text strong>Not Like</Text>
            <Input
              placeholder='Not like'
              onChange={notLikeChange}
              style={{ marginTop: 6, marginBottom: 6 }}
            />
          </Col>
        </Row>
      </Fragment>
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