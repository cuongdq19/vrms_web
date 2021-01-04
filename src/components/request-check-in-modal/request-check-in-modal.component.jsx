import { Button, message, Modal } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../store/actions';
import http from '../../http';
import { UserItemContainer, Container } from './request-check-in-modal.styles';
import UserItem from '../user-item/user-item.component';

const RequestCheckInModal = ({
  providerId,
  visible,
  item,
  onCancel,
  onSuccess,
  checkIn,
}) => {
  const { id, bookingTime } = item ?? {};
  const [technicians, setTechnicians] = useState({ loading: false, data: [] });

  const submitHandler = () =>
    checkIn(id, 1, () => {
      item.checkIn();
      message.success('Check in success.');
      onSuccess();
      onCancel();
    });

  const loadData = useCallback(() => {
    if (visible && item) {
      setTechnicians((curr) => ({ ...curr, loading: true }));
      http
        .get(`/providers/${providerId}/timestamp/${bookingTime}`)
        .then(({ data }) => {
          setTechnicians({ loading: false, data });
        });
    }
  }, [bookingTime, item, providerId, visible]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <Modal
      width="60%"
      centered
      visible={visible}
      title={`Choose Employee to handle request`}
      maskClosable={false}
      onCancel={onCancel}
      footer={null}
    >
      <Container>
        {technicians.data.map((technician) => {
          const { fullName, imageUrl, id } = technician;
          return (
            <UserItemContainer key={id}>
              <UserItem fullName={fullName} imageUrl={imageUrl} />
              <Button onClick={submitHandler}> Select </Button>
            </UserItemContainer>
          );
        })}
      </Container>
    </Modal>
  );
};

const mapStateToProps = ({
  auth: {
    userData: { providerId },
  },
}) => ({
  providerId,
});

const mapDispatchToProps = (dispatch) => ({
  checkIn: (requestId, technicianId, callback) =>
    dispatch(actions.checkInRequest(requestId, technicianId, callback)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RequestCheckInModal);
