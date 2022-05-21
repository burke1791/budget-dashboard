import React, { Fragment } from 'react';
import { Row, Col, Typography, Input } from 'antd';
import { TRANSACTION_CATEGORIZATION_TYPE } from '../../utilities/constants';

const { Text } = Typography;

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

export default TransactionSearchTextInput;