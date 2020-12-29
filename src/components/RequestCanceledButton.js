import { Button, message, Popconfirm } from 'antd';
import React from 'react';
import { useDispatch } from 'react-redux';

import * as actions from '../store/actions';

const RequestCanceledButton = ({ children, id }) => {
  const text = 'Are you sure to cancel this request?';
  const dispatch = useDispatch();

  const submitHandler = () => {
    dispatch(
      actions.cancelRequest(id, () => {
        message.info('Canceled request.');
      })
    );
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
