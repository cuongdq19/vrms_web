import { message, Modal } from 'antd';
import React from 'react';
import { connect } from 'react-redux';

import RequestOverview from '../request-overview/request-overview.component';
import * as actions from '../../store/actions';

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
      width="60%"
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
      <RequestOverview item={item} />
    </Modal>
  );
};

const mapDispatchToProps = (dispatch) => ({
  checkout: (requestId, callback) =>
    dispatch(actions.checkoutRequest(requestId, callback)),
});

export default connect(null, mapDispatchToProps)(RequestCheckoutModal);
