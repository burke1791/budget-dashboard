import React from 'react';
import { Row, Checkbox } from 'antd';

function ThisAccountOnlyCheckbox(props) {

  return (
    <Row justify='center'>
      <Checkbox checked={props.checked} onChange={props.thisAccountOnlyChanged}>This Account Only</Checkbox>
    </Row>
  );
}

export default ThisAccountOnlyCheckbox;