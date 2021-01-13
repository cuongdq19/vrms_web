import { Button, message, Popconfirm, Table } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { Content, Title } from './packages-collection.styles';
import './packages-collection.styles.scss';
import LayoutWrapper from '../../components/layout-wrapper/layout-wrapper.component';
import ModelsSelect from '../../components/models-select/models-select.component';
import CustomModal from '../../components/custom-modal/custom-modal.component';

import http from '../../http';
import {
  calculatePackagePrice,
  formatMoney,
  calculateServicePrice,
} from '../../utils';
import { getColumnSearchProps } from '../../utils/antd';

const PackagesCollection = ({ providerId, history }) => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [models, setModels] = useState([]);
  const [search, setSearch] = useState({
    searchText: '',
    searchedColumn: '',
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearch({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearch({ searchText: '' });
  };

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
        setPackages(
          data.map(({ packagedServices, ...rest }) => ({
            services: packagedServices,
            ...rest,
          }))
        );
        setLoading(false);
      });
  }, [providerId]);

  const servicesColumns = [
    {
      title: 'ID',
      align: 'center',
      dataIndex: 'id',
    },
    {
      title: 'Service Name',
      dataIndex: 'name',
      align: 'center',
      ...getColumnSearchProps('name', handleSearch, handleReset, search),
    },
    {
      title: 'Wages',
      dataIndex: 'price',
      align: 'center',
      render: (value) => formatMoney(value),
    },
    {
      title: 'Total Price',
      align: 'center',
      render: (_, record) => formatMoney(calculateServicePrice(record)),
    },
  ];

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
          rowClassName={(record) =>
            !record.services.every((service) =>
              service.parts.length === 0
                ? true
                : service.parts.every((part) => !part.isDeleted)
            )
              ? 'row-warning'
              : ''
          }
          columns={[
            { title: 'ID', dataIndex: 'id', align: 'center' },
            {
              title: 'Name',
              dataIndex: 'name',
              align: 'center',
              ...getColumnSearchProps(
                'name',
                handleSearch,
                handleReset,
                search
              ),
            },
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
              title: 'Total Price',
              align: 'center',
              render: (_, record) => formatMoney(calculatePackagePrice(record)),
            },
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
          expandable={{
            rowExpandable: (record) => record.services.length > 0,
            expandedRowRender: (record) => {
              return (
                <Table
                  rowKey="id"
                  dataSource={record.services}
                  rowClassName={(record) =>
                    !record.parts.every((part) => !part.isDeleted)
                      ? 'row-warning'
                      : ''
                  }
                  columns={servicesColumns}
                  expandable={{
                    rowExpandable: (record) => record.parts.length > 0,
                    expandedRowRender: (record) => {
                      const partsColumns = [
                        { title: 'ID', dataIndex: 'id', align: 'center' },
                        {
                          title: 'Name',
                          dataIndex: 'name',
                          align: 'center',
                          ...getColumnSearchProps(
                            'name',
                            handleSearch,
                            handleReset,
                            search
                          ),
                        },
                        {
                          title: 'Category',
                          dataIndex: 'categoryName',
                          align: 'center',
                        },

                        {
                          title: 'Description',
                          dataIndex: 'description',
                          align: 'center',
                          ellipsis: true,
                        },

                        {
                          title: 'Price',
                          dataIndex: 'price',
                          render: (value) => formatMoney(value),
                          align: 'center',
                        },
                        {
                          title: 'Quantity',
                          dataIndex: 'quantity',
                          align: 'center',
                        },
                        {
                          title: 'Total Price',
                          align: 'center',
                          render: (_, record) =>
                            formatMoney(record.price * record.quantity),
                        },
                      ];
                      return (
                        <Table
                          loading={loading}
                          rowKey="id"
                          rowClassName={(record) =>
                            record.isDeleted ? 'row-warning' : ''
                          }
                          pagination={{ pageSize: 5 }}
                          dataSource={record.parts}
                          columns={partsColumns}
                        />
                      );
                    },
                  }}
                />
              );
            },
          }}
        />
        <CustomModal
          visible={visible}
          title="Choose New Package Models"
          onCancel={() => setVisible(false)}
          onOk={() => {
            if (models.length === 0) {
              return;
            }
            history.push('/packages/add', { models });
          }}
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
