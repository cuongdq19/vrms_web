import React from 'react';
import { Col, Row } from 'antd';

import { Container } from './request-total-view.styles';
import { formatMoney } from '../../utils';

const RequestTotalRowItem = ({ title, value }) => {
  return (
    <Row gutter={[16, 16]}>
      <Col span={12} style={{ textAlign: 'right' }}>
        <span>{title}</span>
      </Col>
      <Col span={12} style={{ textAlign: 'right' }}>
        <span>{formatMoney(value)}</span>
      </Col>
    </Row>
  );
};

const RequestTotalView = ({ requestItem }) => {
  console.log(requestItem);
  const servicesPrice = requestItem?.services.reduce(
    (accumulated, service) =>
      accumulated +
      service.price +
      service.parts.reduce(
        (accumulatedPrice, part) =>
          accumulatedPrice + part.price * part.quantity,
        0
      ),
    0
  );

  const packagesPrice = requestItem?.packages.reduce(
    (accumulated, packageItem) =>
      accumulated +
      packageItem.services.reduce(
        (accumulatedPrice, service) =>
          accumulatedPrice +
          service.price +
          service.parts.reduce(
            (accumulatedPrice, part) =>
              accumulatedPrice + part.price * part.quantity,
            0
          ),
        0
      ),
    0
  );
  return (
    <Container>
      <RequestTotalRowItem title="Services Total" value={servicesPrice} />
      <RequestTotalRowItem title="Packages Total" value={packagesPrice} />
      <RequestTotalRowItem
        title="Total"
        value={servicesPrice + packagesPrice}
      />
    </Container>
  );
};

export default RequestTotalView;
