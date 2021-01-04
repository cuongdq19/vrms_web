import { message, Modal } from 'antd';
import React from 'react';

import RequestOverview from '../request-overview/request-overview.component';
import * as actions from '../../store/actions';
import { connect } from 'react-redux';

const RequestConfirmModal = ({
  visible,
  item,
  confirmRequest,
  onSuccess,
  onCancel,
}) => {
  const { id } = item ?? {};

  return (
    <Modal
      width="60%"
      centered
      visible={visible}
      title={`Confirm Request #${id}`}
      maskClosable={false}
      onCancel={onCancel}
      onOk={() =>
        confirmRequest(id, () => {
          item.confirm();
          message.success('Confirm success.');
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
  confirmRequest: (requestId, callback) =>
    dispatch(actions.confirmRequest(requestId, callback)),
});

export default connect(null, mapDispatchToProps)(RequestConfirmModal);
