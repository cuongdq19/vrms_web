import { Col, message, Modal, Row } from 'antd';
import React from 'react';
import { connect } from 'react-redux';

import * as actions from '../../store/actions';

import RequestOverview from '../request-overview/request-overview.component';

const RequestCheckoutModal = ({
  visible,
  item,
  checkout,
  onSuccess,
  onCancel,
}) => {
  const { id } = item ?? {};

  return (
    <Modal
      width="90%"
      centered
      visible={visible}
      title={`Checkout Request #${id}`}
      maskClosable={false}
      onCancel={onCancel}
      onOk={() =>
        checkout(id, () => {
          item.checkOut();
          message.success('Checkout success.');
          onSuccess();
          onCancel();
        })
      }
    >
      <Row>
        <Col span={24}>
          <RequestOverview item={item} />
        </Col>
      </Row>
    </Modal>
  );
};

const mapDispatchToProps = (dispatch) => ({
  checkout: (requestId, callback) =>
    dispatch(actions.checkoutRequest(requestId, callback)),
});

export default connect(null, mapDispatchToProps)(RequestCheckoutModal);
