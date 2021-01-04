import { Table, Typography } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import ProviderConfirmButton from '../components/ProviderConfirmButton';
import ProviderResolveButton from '../components/ProviderResolveButton';

import LayoutWrapper from '../components/layout-wrapper/layout-wrapper.component';
import http from '../http';

const Header = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;

const Contracts = () => {
  const [contractsData, setContractsData] = useState([]);

  const fetchContractsData = useCallback(() => {
    return http.get('/contracts').then(({ data }) => {
      setContractsData(data);
    });
  }, []);

  const columns = [
    { title: 'ID', dataIndex: 'id', align: 'center' },
    { title: 'Contact Name', dataIndex: 'fullName', align: 'center' },
    { title: 'Phone Number', dataIndex: 'phoneNumber', align: 'center' },
    { title: 'Email', dataIndex: 'email', align: 'center' },
    { title: 'Status', dataIndex: 'status', align: 'center' },
    {
      title: 'Confirm',
      align: 'center',
      render: (_, record) => {
        return (
          <ProviderConfirmButton
            contract={record}
            onSuccess={fetchContractsData}
          >
            Confirm
          </ProviderConfirmButton>
        );
      },
    },
    {
      title: 'Resolve',
      align: 'center',
      render: (_, record) => {
        return (
          <ProviderResolveButton
            contractId={record.id}
            onSuccess={fetchContractsData}
          >
            Resolve
          </ProviderResolveButton>
        );
      },
    },
  ];

  useEffect(() => {
    fetchContractsData();
  }, [fetchContractsData]);
  return (
    <LayoutWrapper>
      <Header>
        <Typography.Title level={4}>Services</Typography.Title>
      </Header>
      <Table dataSource={contractsData} columns={columns} rowKey="id" />
    </LayoutWrapper>
  );
};

export default Contracts;
