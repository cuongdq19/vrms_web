import { Button, message, Table } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';

import { Content, Title } from './providers-collection.styles';
import LayoutWrapper from '../../components/layout-wrapper/layout-wrapper.component';
import ProviderFormModal from '../../components/provider-update-modal/provider-update-modal.component';

import http from '../../http';

const ProvidersCollection = () => {
  const [providers, setProviders] = useState(false);
  const [modal, setModal] = useState({ visible: false, item: null });

  const loadProviders = useCallback(() => {
    http.get('/providers').then(({ data }) => {
      setProviders(data);
    });
  }, []);

  const updateHandler = (body) => {
    http.post(`/providers/${body.id}`, body).then(({ data }) => {
      loadProviders();
      message.success('Update successfully.');
      setModal({ visible: false, item: null });
    });
  };

  useEffect(() => {
    loadProviders();
  }, [loadProviders]);
  return (
    <LayoutWrapper>
      <Title>
        <h1>Providers</h1>
      </Title>
      <Content>
        <Table
          rowKey="id"
          dataSource={providers}
          columns={[
            {
              title: 'ID',
              align: 'center',
              dataIndex: 'id',
            },
            {
              title: 'Name',
              align: 'center',
              dataIndex: 'name',
            },
            {
              title: 'Address',
              align: 'center',
              dataIndex: 'address',
            },
            {
              title: 'Open Time',
              align: 'center',
              render: (_, { openTime, closeTime }) => {
                return (
                  <>
                    <span>{openTime}</span> - <span>{closeTime}</span>
                  </>
                );
              },
            },
            {
              title: 'Slot Duration',
              align: 'center',
              dataIndex: 'slotDuration',
              render: (value) => value + ' minutes',
            },
            {
              title: 'Slot Capacity',
              align: 'center',
              dataIndex: 'slotCapacity',
            },
            {
              title: 'Update',
              align: 'center',
              render: (_, record) => (
                <Button
                  onClick={() => setModal({ visible: true, item: record })}
                >
                  Update
                </Button>
              ),
            },
          ]}
        />
        <ProviderFormModal
          title="Update Provider"
          item={modal.item}
          visible={modal.visible}
          onCancel={() => setModal({ item: null, visible: false })}
          onSubmit={updateHandler}
        />
      </Content>
    </LayoutWrapper>
  );
};

export default ProvidersCollection;
