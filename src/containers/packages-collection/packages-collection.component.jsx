import { Button, message, Popconfirm, Table } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { Content, Title } from './packages-collection.styles';
import LayoutWrapper from '../../components/layout-wrapper/layout-wrapper.component';
import ServicesCollectionTable from '../../components/services-collection-table/services-collection-table.component';

import http from '../../http';

const PackagesCollection = ({ providerId }) => {
  const [packages, setPackages] = useState([]);

  const removedHandler = (id) => {
    http
      .delete(`/maintenance-packages/packages/${id}`)
      .then(() => {
        return loadData();
      })
      .then(() => {
        message.info('Package successfully removed.');
      });
  };

  const loadData = useCallback(() => {
    return http
      .get(`/maintenance-packages/providers/${providerId}`)
      .then(({ data }) => {
        setPackages(data);
      });
  }, [providerId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <LayoutWrapper>
      <Title>
        <h1>Maintenance Packages</h1>
        <Button>Create Package</Button>
      </Title>
      <Content>
        <Table
          rowKey="id"
          dataSource={packages}
          columns={[
            { title: 'ID', dataIndex: 'id', align: 'center' },
            { title: 'Name', dataIndex: 'name', align: 'center' },
            {
              title: 'Milestone',
              dataIndex: 'milestone',
              align: 'center',
              render: (value) => value ?? 'N/A',
            },
            {
              title: 'Section Name',
              dataIndex: 'sectionName',
              align: 'center',
              render: (value) => value ?? 'N/A',
            },
            {
              title: 'Remove',
              align: 'center',
              render: (_, record) => (
                <Popconfirm
                  title="Are you sure to remove this package?"
                  placement="top"
                  onConfirm={() => removedHandler(record.id)}
                >
                  <Button danger>Remove</Button>
                </Popconfirm>
              ),
            },
          ]}
          expandable={{
            rowExpandable: ({ packagedServices }) =>
              packagedServices.length > 0,
            expandedRowRender: (record) => (
              <ServicesCollectionTable
                dataSource={record.packagedServices}
                rowKey="id"
              />
            ),
          }}
        />
      </Content>
    </LayoutWrapper>
  );
};

const mapStateToProps = ({
  auth: {
    userData: { providerId },
  },
}) => ({
  providerId,
});

export default connect(mapStateToProps)(PackagesCollection);
