import { Button, Col, Form, Popconfirm, Row, Select, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { Content, Title } from './packages-collection.styles';
import CustomModal from '../../components/custom-modal/custom-modal.component';
import LayoutWrapper from '../../components/layout-wrapper/layout-wrapper.component';
import './packages-collection.styles.scss';
import {
  calculatePackagePrice,
  formatMoney,
  calculateServicePrice,
  modelToString,
} from '../../utils';
import { getColumnSearchProps } from '../../utils/antd';
import {
  fetchPackagesStart,
  removePackageStart,
} from '../../redux/package/package.actions';
import { fetchManufacturersAndModels } from '../../redux/model/model.actions';

const PackagesCollection = ({
  providerId,
  packages,
  isFetching,
  history,
  manufacturers,
  models,
  onFetchManufacturersAndModels,
  onFetchPackages,
  onRemovePackage,
}) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState({
    searchText: '',
    searchedColumn: '',
  });
  const [filters, setFilters] = useState({
    manufacturerId: 0,
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
    onRemovePackage(id);
  };

  useEffect(() => {
    onFetchPackages(providerId);
  }, [onFetchPackages, providerId]);

  useEffect(() => {
    if (visible) {
      onFetchManufacturersAndModels();
    }
  }, [onFetchManufacturersAndModels, visible]);

  const filteredModels = models.filter((m) =>
    filters.manufacturerId <= 0
      ? true
      : filters.manufacturerId === m.manufacturerId
  );

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

  return (
    <LayoutWrapper>
      <Title>
        <h1>Maintenance Packages</h1>
        <Button onClick={() => setVisible(true)}>Create Package</Button>
      </Title>
      <Content>
        <Table
          rowKey="id"
          loading={isFetching}
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
                    onClick={() =>
                      history.push(`/packages/${record.id}`, { item: record })
                    }
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
      </Content>
      <CustomModal
        visible={visible}
        title="Choose New Package Models"
        onCancel={() => setVisible(false)}
        onOk={() => form.submit()}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => {
            history.push('/packages/add', values);
          }}
        >
          <Row gutter={[16, 16]}>
            <Col span={6}>
              <Form.Item label="Manufacturers">
                <Select
                  allowClear
                  onClear={() => {
                    setFilters((curr) => ({ ...curr, manufacturerId: 0 }));
                  }}
                  onSelect={(value) => {
                    setFilters((curr) => ({
                      ...curr,
                      manufacturerId: value,
                    }));
                  }}
                  options={manufacturers.map((m) => ({
                    label: m.name,
                    value: m.id,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col span={18}>
              <Form.Item
                label="Models"
                name="modelIds"
                rules={[
                  {
                    required: true,
                    message: "Models can't be blank.",
                    type: 'array',
                    min: 1,
                  },
                ]}
              >
                <Select
                  allowClear
                  showSearch
                  filterOption={(input, option) => {
                    return (
                      option.label.toLowerCase().indexOf(input.toLowerCase()) >=
                      0
                    );
                  }}
                  mode="multiple"
                  onClear={() =>
                    setFilters((curr) => ({ ...curr, serviceModelIds: [] }))
                  }
                  onChange={(value) =>
                    setFilters((curr) => ({
                      ...curr,
                      serviceModelIds: value,
                    }))
                  }
                  options={filteredModels.map((m) => ({
                    label: modelToString(m),
                    value: m.id,
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </CustomModal>
    </LayoutWrapper>
  );
};

const mapStateToProps = (state) => ({
  packages: state.packages.packages,
  isFetching: state.packages.isFetching,
  providerId: state.auth.userData?.providerId,
  models: state.models.models,
  manufacturers: state.manufacturers.manufacturers,
});

const mapDispatchToProps = (dispatch) => ({
  onFetchPackages: (providerId) => dispatch(fetchPackagesStart(providerId)),
  onFetchManufacturersAndModels: () => dispatch(fetchManufacturersAndModels()),
  onRemovePackage: (id) => dispatch(removePackageStart(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PackagesCollection);
