import { message } from 'antd';
import React from 'react';

import RequestOverview from '../request-overview/request-overview.component';
import CustomModal from '../custom-modal/custom-modal.component';
import http from '../../http';

const RequestConfirmModal = ({ visible, item, onSuccess, onCancel }) => {
  const { id } = item ?? {};

  const submitHandler = (item) => {
    http.get(`/requests/confirm/${item.id}`).then(() => {
      item.confirm();
      message.success('Confirm success.');
      onSuccess();
      onCancel();
    });
  };

  return (
    <CustomModal
      visible={visible}
      title={`Confirm Request #${id}`}
      onCancel={onCancel}
      onOk={() => {
        submitHandler(item);
      }}
    >
      <RequestOverview item={item} />
    </CustomModal>
  );
};

export default RequestConfirmModal;
