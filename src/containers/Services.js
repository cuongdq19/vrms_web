import { PlusOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu, Table, Typography } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import ServiceCreateWithoutPartsButton from '../components/ServiceCreateWithoutPartsButton';
import ServiceCreateWithPartsButton from '../components/ServiceCreateWithPartsButton';
import ServiceRemoveButton from '../components/ServiceRemoveButton';
import ServiceUpdateWithoutPartsButton from '../components/ServiceUpdateWithoutPartsButton';
import ServiceUpdateWithPartsButton from '../components/ServiceUpdateWithPartsButton';
import LayoutWrapper from '../hoc/LayoutWrapper';
import http from '../http';

const Header = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;

// const { Option } = Select;

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
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item>
                <ServiceCreateWithPartsButton onSuccess={fetchServicesData}>
                  With Parts
                </ServiceCreateWithPartsButton>
              </Menu.Item>
              <Menu.Item>
                <ServiceCreateWithoutPartsButton onSuccess={fetchServicesData}>
                  Without Parts
                </ServiceCreateWithoutPartsButton>
              </Menu.Item>
            </Menu>
          }
        >
          <Button icon={<PlusOutlined />}>New Service</Button>
        </Dropdown>
      </Header>
      <Table
        rowKey={(record) => record.typeDetail.id}
        dataSource={services}
        columns={columns}
        expandable={{
          expandedRowRender: (record) => {
            const { serviceDetails, typeDetail } = record;
            const columns = [
              { title: 'ID', dataIndex: 'id', align: 'center', width: '10%' },
              {
                title: 'Name',
                dataIndex: 'name',
                align: 'center',
                width: '20%',
              },
              {
                title: 'Price',
                dataIndex: 'price',
                align: 'center',
                width: '20%',
              },
              {
                title: 'Update',
                width: '10%',
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
                width: '10%',
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
