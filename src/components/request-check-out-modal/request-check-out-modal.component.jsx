import React from 'react';
import { connect } from 'react-redux';

import CustomModal from '../custom-modal/custom-modal.component';
import RequestOverview from '../request-overview/request-overview.component';
import { checkoutRequestStart } from '../../redux/request/request.actions';

const RequestCheckoutModal = ({
  visible,
  item,
  isUpdating,
  onCancel,
  onCheckoutRequest,
}) => {
  const { id } = item ?? {};

  const submitHandler = (id) => {
    onCheckoutRequest(id);
  };

  return (
    <CustomModal
      visible={visible}
      title={`Checkout Request #${id}`}
      onCancel={onCancel}
      confirmLoading={isUpdating}
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
  onCheckoutRequest: (id) => dispatch(checkoutRequestStart(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RequestCheckoutModal);
