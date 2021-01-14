import React from 'react';

import RequestOverview from '../request-overview/request-overview.component';
import CustomModal from '../custom-modal/custom-modal.component';
import { confirmRequestStart } from '../../redux/request/request.actions';
import { connect } from 'react-redux';

const RequestConfirmModal = ({
  visible,
  item,
  isUpdating,
  onCancel,
  onConfirmRequest,
}) => {
  const { id } = item ?? {};

  const submitHandler = (id) => {
    onConfirmRequest(id);
  };

  return (
    <CustomModal
      confirmLoading={isUpdating}
      visible={visible}
      title={`Confirm Request #${id}`}
      onCancel={onCancel}
      onOk={() => {
        submitHandler(id);
      }}
    >
      <RequestOverview item={item} />
    </CustomModal>
  );
};

const mapStateToProps = (state) => ({
  isUpdating: state.requests.isUpdating,
});

const mapDispatchToProps = (dispatch) => ({
  onConfirmRequest: (id) => dispatch(confirmRequestStart(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RequestConfirmModal);
