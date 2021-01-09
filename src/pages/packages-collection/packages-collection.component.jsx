import { Button, message, Popconfirm } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { Content, Title } from './packages-collection.styles';
import LayoutWrapper from '../../components/layout-wrapper/layout-wrapper.component';
import ModelsSelect from '../../components/models-select/models-select.component';
import PackagesCollectionTable from '../../components/packages-collection-table/packages-collection-table.component';

import http from '../../http';
import CustomModal from '../../components/custom-modal/custom-modal.component';

const PackagesCollection = ({ providerId, history }) => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [models, setModels] = useState([]);

  const removedHandler = (id) => {
    http.delete(`/maintenance-packages/packages/${id}`).then(() => {
      message.success('Successfully removed package.');
      loadData();
    });
  };

  const loadData = useCallback(() => {
    setLoading(true);

    http
      .get(`/maintenance-packages/providers/${providerId}`)
      .then(({ data }) => {
        setPackages(data);
        setLoading(false);
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
        <PackagesCollectionTable
          loading={loading}
          rowKey="id"
          dataSource={packages.map(({ packagedServices, ...rest }) => ({
            services: packagedServices.map(({ parts, ...rest }) => ({
              ...rest,
              parts: parts.map(({ id, name, ...rest }) => ({
                partId: id,
                partName: name,
                ...rest,
              })),
            })),
            ...rest,
          }))}
          columns={[
            {
              title: 'Update',
              align: 'center',
              render: (_, record) => {
                return (
                  <Button
                    onClick={() => history.push(`/packages/${record.id}`)}
                  >
                    Update
                  </Button>
                );
              },
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
        />
        <CustomModal
          visible={visible}
          title="Choose New Package Models"
          onCancel={() => setVisible(false)}
          onOk={() => history.push('/packages/add', { models })}
        >
          <ModelsSelect
            models={models}
            onChange={(value) => setModels(value)}
          />
        </CustomModal>
      </Content>
    </LayoutWrapper>
  );
};

const mapStateToProps = (state) => ({
  providerId: state.auth.userData?.providerId,
});

export default connect(mapStateToProps)(PackagesCollection);
