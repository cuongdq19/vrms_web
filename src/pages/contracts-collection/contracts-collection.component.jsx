import React, { useCallback, useEffect, useState } from 'react';
import { Button, Dropdown, Menu, message, Popconfirm, Table, Tag } from 'antd';

import { Content, Title } from './contracts-collection.styles';
import LayoutWrapper from '../../components/layout-wrapper/layout-wrapper.component';

import http from '../../http';
import { generateContractStatusColor } from '../../utils';
import ContractUploadModal from '../../components/contract-upload-modal/contract-upload-modal.component';
import { contractStatus } from '../../utils/constants';

const ContractsCollection = ({ history }) => {
  const [contracts, setContracts] = useState([]);
  const [confirming, setConfirming] = useState({ visible: false, item: null });
  const [denying, setDenying] = useState(false);

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

  const deniedHandler = (contractId) => {
    http.get(`/contracts/deny/${contractId}`).then(({ data }) => {
      setDenying(false);
      message.info('Successfully.');
      loadContracts();
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
      title: 'Verify',
      align: 'center',
      render: (_, record) => {
        return (
          <Dropdown
            disabled={[
              contractStatus.Confirmed,
              contractStatus.Denied,
              contractStatus.Resolved,
            ].includes(record.status)}
            trigger="click"
            arrow
            overlay={
              <Menu>
                <Menu.Item
                  onClick={() => {
                    setConfirming({ visible: true, item: record });
                  }}
                >
                  <Button type="link">Confirm</Button>
                </Menu.Item>
                <Menu.Item onClick={() => setDenying(true)}>
                  <Popconfirm
                    visible={denying}
                    title="Are you sure to deny this contract?"
                    onConfirm={() => deniedHandler(record.id)}
                  >
                    <Button type="link" danger>
                      Deny
                    </Button>
                  </Popconfirm>
                </Menu.Item>
              </Menu>
            }
          >
            <Button>Verify</Button>
          </Dropdown>
        );
      },
    },
    {
      title: 'Resolve',
      align: 'center',
      render: (_, record) => {
        return (
          <Button
            disabled={[
              contractStatus.Pending,
              contractStatus.Denied,
              contractStatus.Resolved,
            ].includes(record.status)}
            type="primary"
            onClick={() => history.push(`/contracts/${record.id}`)}
          >
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
