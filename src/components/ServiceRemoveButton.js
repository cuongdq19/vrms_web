import { Button, message, Popconfirm } from 'antd';
import React from 'react';

import http from '../http';

const ServiceRemoveButton = ({ serviceId, onSuccess }) => {
  const text = 'Are you sure to remove this service?';

  const submitHandler = () => {
    http.delete(`/services/${serviceId}`).then(({ data }) => {
      message.info('Remove service success.');
      onSuccess();
    });
  };
  return (
    <Popconfirm
      cancelText="No"
      okText="Yes"
      onConfirm={submitHandler}
      placement="left"
      title={text}
    >
      <Button>Delete</Button>
    </Popconfirm>
  );
};

export default ServiceRemoveButton;
