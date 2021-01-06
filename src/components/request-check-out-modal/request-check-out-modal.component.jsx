import { Col, message, Modal, Row } from 'antd';
import React from 'react';
import { connect } from 'react-redux';

import * as actions from '../../store/actions';
import { calculateRequestPrice, formatMoney } from '../../utils';
import ServicesCollectionTable from '../services-collection-table/services-collection-table.component';
import { Summary } from './request-check-out-modal.styles';

const RequestCheckoutModal = ({
  visible,
  item,
  checkout,
  onSuccess,
  onCancel,
}) => {
  const { id } = item ?? {};

  let total = 0;
  if (item) {
    total = calculateRequestPrice({
      services: item.services.filter(({ isActive }) => isActive),
    });
  }

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
      <Row>
        <Col span={24}>
          <ServicesCollectionTable
            dataSource={item?.services.map(
              ({ id, serviceName, servicePrice, parts, ...rest }) => ({
                id,
                name: serviceName,
                price: servicePrice,
                parts: parts.map(({ partId, partName, ...rest }) => ({
                  id: partId,
                  name: partName,
                  ...rest,
                })),
              })
            )}
            rowKey="id"
          />
        </Col>
        <Col span={8} offset={16}>
          <Summary justify="end" align="middle" gutter={[8, 8]}>
            <Col span={6}>
              <span>Services: </span>
            </Col>
            <Col span={18}>
              <h3>{formatMoney(total.services)}</h3>
            </Col>
            <Col span={6}>
              <span>Total: </span>
            </Col>
            <Col span={18}>
              <h3>{formatMoney(total.total)}</h3>
            </Col>
          </Summary>
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
