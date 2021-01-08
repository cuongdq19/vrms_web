import { Button, message } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';

import http from '../../http';
import { UserItemContainer, Container } from './request-check-in-modal.styles';
import UserItem from '../user-item/user-item.component';
import CustomModal from '../custom-modal/custom-modal.component';

const RequestCheckInModal = ({
  providerId,
  visible,
  item,
  onCancel,
  onSuccess,
}) => {
  const { id, bookingTime } = item ?? {};
  const [technicians, setTechnicians] = useState({ loading: false, data: [] });

  const submitHandler = (techId) =>
    http.post(`/requests/checkin/${id}/technicians/${techId}`).then(() => {
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
    <CustomModal
      visible={visible}
      title={`Choose Employee to handle request`}
      onCancel={onCancel}
      footer={null}
    >
      <Container>
        {technicians.data.map((technician) => {
          const { fullName, imageUrl, id } = technician;
          return (
            <UserItemContainer key={id}>
              <UserItem fullName={fullName} imageUrl={imageUrl} />
              <Button onClick={() => submitHandler(id)}> Select </Button>
            </UserItemContainer>
          );
        })}
      </Container>
    </CustomModal>
  );
};

const mapStateToProps = (state) => ({
  providerId: state.auth.userData?.providerId,
});

export default connect(mapStateToProps)(RequestCheckInModal);
