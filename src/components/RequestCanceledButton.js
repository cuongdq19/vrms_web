import { Button, message, Popconfirm } from 'antd';
import React from 'react';
import { useDispatch } from 'react-redux';

import * as actions from '../store/actions';

const RequestCanceledButton = ({
  children,
  id,
  disabled,
  onStateTransition,
}) => {
  const text = 'Are you sure to cancel this request?';
  const dispatch = useDispatch();

  const submitHandler = () => {
    dispatch(
      actions.cancelRequest(id, () => {
        onStateTransition();
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
      <Button disabled={disabled} danger>
        {children}
      </Button>
    </Popconfirm>
  );
};

export default RequestCanceledButton;
