import { message } from 'antd';
import React from 'react';

import RequestOverview from '../request-overview/request-overview.component';
import * as actions from '../../store/actions';
import { connect } from 'react-redux';
import CustomModal from '../custom-modal/custom-modal.component';

const RequestConfirmModal = ({
  visible,
  item,
  confirmRequest,
  onSuccess,
  onCancel,
}) => {
  const { id } = item ?? {};

  return (
    <CustomModal
      visible={visible}
      title={`Confirm Request #${id}`}
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
    </CustomModal>
  );
};

const mapDispatchToProps = (dispatch) => ({
  confirmRequest: (requestId, callback) =>
    dispatch(actions.confirmRequest(requestId, callback)),
});

export default connect(null, mapDispatchToProps)(RequestConfirmModal);
