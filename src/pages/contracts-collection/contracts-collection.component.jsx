import React, { useCallback, useEffect, useState } from 'react';
import { Button, message, Table, Tag } from 'antd';

import { Content, Title } from './contracts-collection.styles';
import LayoutWrapper from '../../components/layout-wrapper/layout-wrapper.component';

import http from '../../http';
import { generateContractStatusColor } from '../../utils';
import ContractUploadModal from '../../components/contract-upload-modal/contract-upload-modal.component';

const ContractsCollection = ({ history }) => {
  const [contracts, setContracts] = useState([]);
  const [confirming, setConfirming] = useState({ visible: false, item: null });

  const confirmedHandler = (item) => {
    const { images, contractId } = item;
    const formData = new FormData();
    images.forEach((image) => {
      formData.append('images', image);
    });
    http.post(`/contracts/confirm/${contractId}`, formData).then(({ data }) => {
      message.success('Confirm contract success.');
      loadContracts();
      setConfirming({ visible: false, item: null });
    });
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', align: 'center' },
    { title: 'Full Name', dataIndex: 'fullName', align: 'center' },
    { title: 'Address', dataIndex: 'address', align: 'center' },
    { title: 'Phone Number', dataIndex: 'phoneNumber', align: 'center' },
    { title: 'Email', dataIndex: 'email', align: 'center' },
    {
      title: 'Status',
      dataIndex: 'status',
      align: 'center',
      render: (value) => (
        <Tag color={generateContractStatusColor(value)}>{value}</Tag>
      ),
    },
    {
      title: 'Confirm',
      align: 'center',
      render: (_, record) => {
        return (
          <Button
            onClick={() => {
              setConfirming({ visible: true, item: record });
            }}
          >
            Confirm
          </Button>
        );
      },
    },
    {
      title: 'Resolve',
      align: 'center',
      render: (_, record) => {
        return (
          <Button onClick={() => history.push(`/contracts/${record.id}`)}>
            Resolve
          </Button>
        );
      },
    },
  ];

  const loadContracts = useCallback(() => {
    return http.get('/contracts').then(({ data }) => {
      setContracts(data);
    });
  }, []);

  useEffect(() => {
    loadContracts();
  }, [loadContracts]);

  return (
    <LayoutWrapper>
      <Title>
        <h1>Contracts</h1>
      </Title>
      <Content>
        <Table dataSource={contracts} columns={columns} rowKey="id" />
      </Content>
      <ContractUploadModal
        {...confirming}
        onCancel={() => setConfirming({ visible: false, item: null })}
        onSubmit={confirmedHandler}
      />
    </LayoutWrapper>
  );
};

export default ContractsCollection;
