import { message } from 'antd';
import React, { useState } from 'react';

import RequestOverview from '../request-overview/request-overview.component';
import CustomModal from '../custom-modal/custom-modal.component';
import http from '../../http';

const RequestConfirmModal = ({ visible, item, onSuccess, onCancel }) => {
  const { id } = item ?? {};
  const [loading, setLoading] = useState(false);

  const submitHandler = (item) => {
    setLoading(true);
    http.get(`/requests/confirm/${item.id}`).then(() => {
      item.confirm();
      message.success('Confirm success.');
      onSuccess();
      onCancel();
      setLoading(true);
    });
  };

  return (
    <CustomModal
      confirmLoading={loading}
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
