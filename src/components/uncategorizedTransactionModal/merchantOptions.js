import React, { useState, Fragment } from 'react';
import { Button, Col, Row, Select, Typography } from 'antd';
import { useBudgetState } from '../../context/budgetContext';
import NewMerchantModal from './newMerchantModal';

const { Text } = Typography;
const { Option } = Select;

function MerchantOptions(props) {

  const [newMerchantModalVisible, setNewMerchantModalVisible] = useState(false);

  const { merchants } = useBudgetState();

  const generateMerchantsList = () => {
    return merchants.map(merchant => {
      return <Option key={merchant.merchantId} value={merchant.merchantId}>{merchant.merchantName}</Option>;
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
  );
}

export default MerchantOptions;