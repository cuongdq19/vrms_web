import React, { useCallback, useEffect, useState } from 'react';
import { Button, message, Popconfirm } from 'antd';
import { connect } from 'react-redux';

import { Content, Title } from './services-collection.styles';
import http from '../../http';

import LayoutWrapper from '../../components/layout-wrapper/layout-wrapper.component';
import ServicesCollectionTable from '../../components/services-collection-table/services-collection-table.component';

const ServicesCollection = ({ providerId, history }) => {
  const [services, setServices] = useState([]);

  const removedHandler = (serviceId) => {
    http.delete(`/services/${serviceId}`).then(({ data }) => {
      message.info('Remove service success.');
      loadData();
    });
  };
  const loadData = useCallback(() => {
    http
      .get(`/maintenance-packages/providers/${providerId}/services`)
      .then(({ data }) => {
        setServices(data);
      });
  }, [providerId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <LayoutWrapper>
      <Title>
        <h1>Services</h1>
        <Button onClick={() => history.push('/services/add')}>
          Create Service
        </Button>
      </Title>
      <Content>
        <ServicesCollectionTable
          dataSource={services}
          rowKey="id"
          columns={[
            {
              align: 'center',
              title: 'Service Type',
              render: (_, { typeDetail }) =>
                `${
                  typeDetail.typeName
                } ${typeDetail.sectionName.toLowerCase()}`,
            },
            {
              title: 'Update',
              align: 'center',
              render: (_, record) => (
                <Button
                  onClick={() =>
                    history.push(`/services/${record.id}`, {
                      item: record,
                      typeId: record.typeDetail.typeId,
                      typeDetailId: record.typeDetail.id,
                    })
                  }
                >
                  Update
                </Button>
              ),
            },
            {
              title: 'Remove',
              align: 'center',
              render: (_, record) => {
                const { id } = record;
                return (
                  <Popconfirm
                    title="Are you sure to remove this service?"
                    onConfirm={() => removedHandler(id)}
                  >
                    <Button danger>Remove</Button>
                  </Popconfirm>
                );
              },
            },
          ]}
        />
      </Content>
    </LayoutWrapper>
  );
};

const mapStateToProps = (state) => ({
  providerId: state.auth.userData.providerId,
});

export default connect(mapStateToProps)(ServicesCollection);
