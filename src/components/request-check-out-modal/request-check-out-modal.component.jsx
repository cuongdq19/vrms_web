import { Col, message, Row } from 'antd';
import React from 'react';

import CustomModal from '../custom-modal/custom-modal.component';
import RequestOverview from '../request-overview/request-overview.component';
import http from '../../http';

const RequestCheckoutModal = ({ visible, item, onSuccess, onCancel }) => {
  const { id } = item ?? {};

  const submitHandler = (item) => {
    http.get(`/requests/checkout/${item.id}`).then(() => {
      item.checkOut();
      message.success('Checkout success.');
      onSuccess();
      onCancel();
    });
  };

  return (
    <CustomModal
      visible={visible}
      title={`Checkout Request #${id}`}
      onCancel={onCancel}
      onOk={() => {
        submitHandler(item);
      }}
    >
      <Row>
        <Col span={24}>
          <RequestOverview item={item} />
        </Col>
      </Row>
    </CustomModal>
  );
};

export default RequestCheckoutModal;
