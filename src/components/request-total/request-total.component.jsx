import { Col } from 'antd';
import React from 'react';
import { formatMoney } from '../../utils';

import { Summary } from './request-total.styles';

const RequestTotal = ({ confirmedPrice, incurredPrice }) => {
  return (
    <Summary justify="end" align="middle" gutter={[8, 8]}>
      <Col span={8}>
        <span>Confirmed: </span>
      </Col>
      <Col span={16}>
        <h3>{formatMoney(confirmedPrice.total)}</h3>
      </Col>
      <Col span={8}>
        <span>Incurred Services: </span>
      </Col>
      <Col span={16}>
        <h3>{formatMoney(incurredPrice.services)}</h3>
      </Col>
      <Col span={8}>
        <span>Incurred Packages: </span>
      </Col>
      <Col span={16}>
        <h3>{formatMoney(incurredPrice.packages)}</h3>
      </Col>
      <Col span={8}>
        <span>Incurred Total: </span>
      </Col>
      <Col span={16}>
        <h3>{formatMoney(incurredPrice.total)}</h3>
      </Col>
      <Col span={8}>
        <span>Total: </span>
      </Col>
      <Col span={16}>
        <h3>{formatMoney(incurredPrice.total + confirmedPrice.total)}</h3>
      </Col>
    </Summary>
  );
};

export default RequestTotal;
