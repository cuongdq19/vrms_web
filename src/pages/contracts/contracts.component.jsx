import React, { useCallback, useEffect, useState } from 'react';
import { Button, Col, message, Popconfirm, Row, Table, Tag } from 'antd';

import { Content, Title } from './contracts.styles';
import LayoutWrapper from '../../components/layout-wrapper/layout-wrapper.component';

import http from '../../http';
import { generateContractStatusColor } from '../../utils';
import ContractUploadModal from '../../components/contract-upload-modal/contract-upload-modal.component';
import { contractStatus } from '../../utils/constants';

const ContractsPage = ({ history }) => {
  const [contracts, setContracts] = useState([]);
  const [confirming, setConfirming] = useState({ visible: false, item: null });
  const [denying, setDenying] = useState(false);

  const confirmedHandler = (item) => {
    const { images, contractId } = item;
    const formData = new FormData();
    images.forEach((image) => {
      formData.append('images', image);
    });
    http.post(`/contracts/confirm/${contractId}`, formData).then(({}) => {
      message.success('Confirm contract success.');
      loadContracts();
      setConfirming({ visible: false, item: null });
    });
  };

  const deniedHandler = (contractId) => {
    http.get(`/contracts/deny/${contractId}`).then(() => {
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
      title: 'Actions',
      render: (_, record) => (
        <Row gutter={16}>
          {record.status === contractStatus.Pending && (
            <Col>
              <Button
                onClick={() => {
                  setConfirming({ visible: true, item: record });
                }}
              >
                Confirm
              </Button>
            </Col>
          )}
          {record.status === contractStatus.Pending && (
            <Col>
              <Popconfirm
                visible={denying}
                title="Are you sure to deny this contract?"
                onConfirm={() => deniedHandler(record.id)}
              >
                <Button danger>Deny</Button>
              </Popconfirm>
            </Col>
          )}
          {record.status === contractStatus.Confirmed && (
            <Col>
              <Button
                type="primary"
                onClick={() => history.push(`/contracts/${record.id}`)}
              >
                Resolve
              </Button>
            </Col>
          )}
        </Row>
      ),
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

export default ContractsPage;
