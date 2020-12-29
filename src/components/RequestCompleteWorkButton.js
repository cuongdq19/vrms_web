import { Button, message, Popconfirm } from 'antd';
import React from 'react';
import { useDispatch } from 'react-redux';

import * as actions from '../store/actions';

const RequestCompleteWorkButton = ({ children, id }) => {
  const dispatch = useDispatch();
  const text = 'Are you sure to finish this request?';

  const submitHandler = () => {
    dispatch(
      actions.completeRequest(id, () => {
        message.success('Update request success.');
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
      <Button>{children}</Button>
    </Popconfirm>
  );
};

export default RequestCompleteWorkButton;
