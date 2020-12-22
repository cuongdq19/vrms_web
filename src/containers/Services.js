import { Select, Table, Typography } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import ServiceCreateButton from '../components/ServiceCreateButton';
import ServiceUpdateButton from '../components/ServiceUpdateButton';
import LayoutWrapper from '../hoc/LayoutWrapper';
import http from '../http';

const Header = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;

const { Option } = Select;

const Services = () => {
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
    { title: 'ID', dataIndex: ['typeDetail', 'id'] },
    {
      title: 'Service Type',
      dataIndex: ['typeDetail', 'typeName'],
    },
    {
      title: 'Section Name',
      dataIndex: ['typeDetail', 'sectionName'],
    },
  ];

  useEffect(() => {
    fetchServicesData();
  }, [fetchServicesData]);
  return (
    <LayoutWrapper>
      <Header>
        <Typography.Title level={4}>Services</Typography.Title>
        <ServiceCreateButton onSuccess={fetchServicesData}>
          New Service
        </ServiceCreateButton>
      </Header>
      <Table
        rowKey={(record) => record.typeDetail.id}
        dataSource={services}
        columns={columns}
        expandable={{
          expandedRowRender: (record) => {
            const { serviceDetails } = record;
            const columns = [
              { title: 'ID', dataIndex: 'id' },
              { title: 'Name', dataIndex: 'name' },
              { title: 'Price', dataIndex: 'price' },
              {
                title: 'Models',
                render: (_, { group: { models } }) => (
                  <Select style={{ width: '100%' }}>
                    {models.map((mod) => (
                      <Option key={mod.id} value={mod.id}>
                        {mod.name} {mod.fuelType} {mod.gearbox} ({mod.year})
                      </Option>
                    ))}
                  </Select>
                ),
              },
              {
                title: 'Update',
                render: (_, record) => {
                  console.log(record);
                  const {
                    id,
                    name,
                    price,
                    group: { models },
                  } = record;
                  const modelIds = models.map((mod) => mod.id);
                  return (
                    <ServiceUpdateButton
                      service={{ id, name, price, modelIds }}
                      onSuccess={fetchServicesData}
                    >
                      Update
                    </ServiceUpdateButton>
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
