import { Button } from 'antd';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { UserItemContainer, Container } from './request-check-in-modal.styles';
import UserItem from '../user-item/user-item.component';
import CustomModal from '../custom-modal/custom-modal.component';
import LoadingSpinner from '../loading-spinner/loading-spinner.component';
import {
  fetchAvailableTechniciansStart,
  checkInRequestsStart,
} from '../../redux/request/request.actions';

const RequestCheckInModal = ({
  visible,
  item,
  technicians,
  isFetching,
  onCancel,
  onCheckInRequest,
  onFetchAvailableTechnicians,
}) => {
  const { id, bookingTime } = item ?? {};

  const submitHandler = (technicianId) => {
    onCheckInRequest({ requestId: id, technicianId });
  };

  useEffect(() => {
    if (visible && item) {
      console.log('hello');
      onFetchAvailableTechnicians(bookingTime);
    }
  }, [bookingTime, item, onFetchAvailableTechnicians, visible]);

  return (
    <CustomModal
      visible={visible}
      title={`Choose Employee to handle request`}
      onCancel={onCancel}
      footer={null}
    >
      <Container>
        {isFetching ? (
          <LoadingSpinner title="Loading ..." />
        ) : (
          technicians.map((technician) => {
            const { fullName, imageUrl, id } = technician;
            return (
              <UserItemContainer key={id}>
                <UserItem fullName={fullName} imageUrl={imageUrl} />
                <Button onClick={() => submitHandler(id)}> Select </Button>
              </UserItemContainer>
            );
          })
        )}
      </Container>
    </CustomModal>
  );
};

const mapStateToProps = (state) => ({
  providerId: state.auth.userData?.providerId,
  isFetching: state.requests.isFetching,
  technicians: state.requests.technicians,
});

const mapDispatchToProps = (dispatch) => ({
  onFetchAvailableTechnicians: (bookingTime) =>
    dispatch(fetchAvailableTechniciansStart(bookingTime)),
  onCheckInRequest: ({ requestId, technicianId }) =>
    dispatch(checkInRequestsStart({ requestId, technicianId })),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RequestCheckInModal);
