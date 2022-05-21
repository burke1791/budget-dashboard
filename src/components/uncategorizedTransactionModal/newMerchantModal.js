import React from 'react';
import { Modal } from 'antd';
import NewMerchant from './newMerchant';

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

export default NewMerchantModal;