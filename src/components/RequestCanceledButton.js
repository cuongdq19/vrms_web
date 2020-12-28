import { Button, message, Popconfirm } from 'antd';
import React from 'react';

import http from '../http';

const RequestCanceledButton = ({ children, id, onSuccess }) => {
  const text = 'Are you sure to cancel this request?';

  const submitHandler = () => {
    http.delete(`/requests/${id}`).then(({ data }) => {
      message.info('Canceled request.');
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
      <Button danger>{children}</Button>
    </Popconfirm>
  );
};

export default RequestCanceledButton;
