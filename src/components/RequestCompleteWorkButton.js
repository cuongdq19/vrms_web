import { Button, message, Popconfirm } from 'antd';
import React from 'react';

import http from '../http';

const RequestCompleteWorkButton = ({ children, id, onSuccess }) => {
  const text = 'Are you sure to finish this request?';

  const submitHandler = () => {
    http.get(`/requests/done/${id}`).then(({ data }) => {
      message.success('Update request success.');
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
      <Button>{children}</Button>
    </Popconfirm>
  );
};

export default RequestCompleteWorkButton;
