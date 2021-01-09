import { message } from 'antd';
import React, { useState } from 'react';

import CustomModal from '../custom-modal/custom-modal.component';
import RequestOverview from '../request-overview/request-overview.component';
import http from '../../http';

const RequestCheckoutModal = ({ visible, item, onSuccess, onCancel }) => {
  const { id } = item ?? {};
  const [submitting, setSubmitting] = useState(false);

  const submitHandler = (item) => {
    setSubmitting(true);
    http.get(`/requests/checkout/${item.id}`).then(() => {
      item.checkOut();
      message.success('Checkout success.');
      onSuccess();
      onCancel();
      setSubmitting(false);
    });
  };

  return (
    <CustomModal
      visible={visible}
      title={`Checkout Request #${id}`}
      onCancel={onCancel}
      loading={submitting}
      onOk={() => {
        submitHandler(item);
      }}
    >
      <RequestOverview item={item} />
    </CustomModal>
  );
};

export default RequestCheckoutModal;
