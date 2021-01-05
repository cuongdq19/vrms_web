import { Button, message, Modal, Popconfirm, Table } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { Content, Title } from './packages-collection.styles';
import LayoutWrapper from '../../components/layout-wrapper/layout-wrapper.component';
import ServicesCollectionTable from '../../components/services-collection-table/services-collection-table.component';
import ModelsSelect from '../../components/models-select/models-select.component';

import http from '../../http';

const PackagesCollection = ({ providerId, history }) => {
  const [packages, setPackages] = useState([]);
  const [visible, setVisible] = useState(false);
  const [models, setModels] = useState([]);

  const removedHandler = (id) => {
    http.delete(`/maintenance-packages/packages/${id}`).then(() => {
      message.success('Successfully removed package.');
      loadData();
    });
  };

  const loadData = useCallback(() => {
    http
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
        <Button onClick={() => setVisible(true)}>Create Package</Button>
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
              title: 'Update',
              align: 'center',
              render: (_, record) => (
                <Button onClick={() => history.push(`/packages/${record.id}`)}>
                  Update
                </Button>
              ),
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
        <Modal
          visible={visible}
          title="Choose New Package Models"
          onCancel={() => setVisible(false)}
          onOk={() => history.push('/packages/add', { models })}
        >
          <ModelsSelect
            models={models}
            onChange={(value) => setModels(value)}
          />
        </Modal>
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
