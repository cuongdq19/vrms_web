import { Modal } from 'antd';
import React from 'react';

const CustomModal = (props) => {
  return <Modal centered width="80%" maskClosable={false} {...props} />;
};

export default CustomModal;
