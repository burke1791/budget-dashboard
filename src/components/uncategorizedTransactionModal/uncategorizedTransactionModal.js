import React from 'react';
import { Modal } from 'antd';
import UncategorizedTransactionAction from './uncategorizedTransactionAction';

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

export default UncategorizedTransactionModal;