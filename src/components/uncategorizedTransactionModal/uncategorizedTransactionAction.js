import React, { Fragment, useState, useEffect, useRef } from 'react';
import useApi from '../../hooks/useApi';
import { TRANSACTION_CATEGORIZATION_TYPE, ENDPOINTS } from '../../utilities/constants';
import { Row, Col, Table, Divider, Radio, Button, message } from 'antd';
import MerchantOptions from './merchantOptions';
import CategoryOptions from './categoryOptions';
import ThisAccountOnlyCheckbox from './thisAccountOnlyCheckbox';
import TransactionSearchTextInput from './transactionSearchTextInput';
import SimilarTransactions from './similarTransactions';
import moment from 'moment';
import { formatMoney } from '../../utilities/formatter';

const { Column } = Table;

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

    return null;
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

export default UncategorizedTransactionAction;