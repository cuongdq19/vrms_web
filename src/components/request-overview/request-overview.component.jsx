import { Col, Row } from 'antd';
import React from 'react';
import moment from 'moment';

import { calculateRequestPrice, formatMoney } from '../../utils';
import { Summary } from './request-overview.styles';

import ServicesCollectionTable from '../services-collection-table/services-collection-table.component';
import PackagesCollectionTable from '../packages-collection-table/packages-collection-table.component';

const RequestOverview = ({ item }) => {
  const {
    services = [],
    packages = [],
    fullName,
    phoneNumber,
    bookingTime,
    note,
  } = item;

  let total = null;

  if (item) {
    total = calculateRequestPrice({ services, packages });
  }

  return (
    <Row gutter={[8, 8]}>
      <Col span={12}>
        <Row align="middle" gutter={[8, 8]}>
          <Col span={24}>
            <h3>Request Details</h3>
          </Col>
          <Col span={8}>
            <span>Full Name: </span>
          </Col>
          <Col span={16}>
            <h4>{fullName}</h4>
          </Col>
          <Col span={8}>
            <span>Phone Number: </span>
          </Col>
          <Col span={16}>
            <h4>{phoneNumber}</h4>
          </Col>
          <Col span={8}>
            <span>Booking Date: </span>
          </Col>
          <Col span={16}>
            <h4>{moment.unix(bookingTime).format('DD/MM/YYYY')}</h4>
          </Col>
          <Col span={8}>
            <span>Booking Time: </span>
          </Col>
          <Col span={16}>
            <h4>{moment.unix(bookingTime).format('HH:mm')}</h4>
          </Col>
          <Col span={8}>
            <span>Note: </span>
          </Col>
          <Col span={16}>
            <h4>{note}</h4>
          </Col>
        </Row>
      </Col>
      <Col span={12}></Col>
      <Col span={24}>
        <h3>Services</h3>
      </Col>
      <Col span={24}>
        <ServicesCollectionTable
          size="small"
          dataSource={services
            .filter((service) => service.isActive)
            .map(
              ({ serviceId, serviceName, servicePrice, parts, ...rest }) => ({
                id: serviceId,
                price: servicePrice,
                name: serviceName,
                parts,
                ...rest,
              })
            )}
          rowKey="id"
        />
      </Col>
      <Col span={24}>
        <PackagesCollectionTable
          size="small"
          dataSource={packages.map(
            ({ packageId, packageName, services, ...rest }) => ({
              id: packageId,
              name: packageName,
              services: services
                .filter((service) => service.isActive)
                .map(
                  ({
                    serviceId,
                    serviceName,
                    servicePrice,
                    parts,
                    ...rest
                  }) => ({
                    id: serviceId,
                    name: serviceName,
                    price: servicePrice,
                    parts,
                    ...rest,
                  })
                ),
              ...rest,
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
            <span>Packages: </span>
          </Col>
          <Col span={18}>
            <h3>{formatMoney(total.packages)}</h3>
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
  );
};

export default RequestOverview;
