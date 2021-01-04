import { Button, Table, Typography } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import ServiceRemoveButton from '../components/ServiceRemoveButton';
import ServiceUpdateWithoutPartsButton from '../components/ServiceUpdateWithoutPartsButton';
import ServiceUpdateWithPartsButton from '../components/ServiceUpdateWithPartsButton';
import LayoutWrapper from '../components/layout-wrapper/layout-wrapper.component';
import http from '../http';
import { formatMoney } from '../utils';

const Header = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;

// const { Option } = Select;

const Services = ({ history }) => {
  const providerId = useSelector((state) => state.auth.userData.providerId);
  const [services, setServices] = useState([]);

  const fetchServicesData = useCallback(() => {
    http
      .get(`/services/providers/${providerId}`)
      .then(({ data }) => {
        setServices(data);
      })
      .catch((err) => console.log(err));
  }, [providerId]);

  const columns = [
    {
      title: 'ID',
      dataIndex: ['typeDetail', 'id'],
      align: 'center',
    },
    {
      title: 'Service Type',
      dataIndex: ['typeDetail', 'typeName'],
      align: 'center',
    },
    {
      title: 'Section Name',
      dataIndex: ['typeDetail', 'sectionName'],
      align: 'center',
    },
  ];

  useEffect(() => {
    fetchServicesData();
  }, [fetchServicesData]);

  return (
    <LayoutWrapper>
      <Header>
        <Typography.Title level={4}>Services</Typography.Title>
        <Button onClick={() => history.push('/services/add')}>
          Create Service
        </Button>
      </Header>
      <Table
        rowKey={(record) => record.typeDetail.id}
        dataSource={services}
        columns={columns}
        expandable={{
          expandedRowRender: (record) => {
            const { serviceDetails, typeDetail } = record;
            const columns = [
              { title: 'ID', dataIndex: 'id', align: 'center' },
              {
                title: 'Name',
                dataIndex: 'name',
                align: 'center',
              },
              {
                title: 'Price',
                dataIndex: 'price',
                align: 'center',
                render: (value) => formatMoney(value),
              },
              {
                title: 'Update',
                align: 'center',
                render: (_, record) => {
                  const { parts } = record;

                  if (parts.length === 0) {
                    return (
                      <ServiceUpdateWithoutPartsButton
                        onSuccess={fetchServicesData}
                        serviceDetail={record}
                        typeDetail={typeDetail}
                      >
                        Update
                      </ServiceUpdateWithoutPartsButton>
                    );
                  }
                  return (
                    <ServiceUpdateWithPartsButton
                      onSuccess={fetchServicesData}
                      serviceDetail={record}
                      typeDetail={typeDetail}
                    >
                      Update
                    </ServiceUpdateWithPartsButton>
                  );
                },
              },
              {
                title: 'Remove',
                align: 'center',
                render: (_, record) => {
                  const { id } = record;
                  return (
                    <ServiceRemoveButton
                      serviceId={id}
                      onSuccess={fetchServicesData}
                    >
                      Remove
                    </ServiceRemoveButton>
                  );
                },
              },
            ];
            return (
              <Table
                rowKey="id"
                columns={columns}
                dataSource={serviceDetails}
              />
            );
          },
        }}
      />
    </LayoutWrapper>
  );
};

export default Services;
