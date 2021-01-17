import React, { useEffect, useState } from 'react';
import { Button, Popconfirm, Table } from 'antd';
import { connect } from 'react-redux';

import { Content, Title } from './services.styles';
import './services.styles.scss';

import LayoutWrapper from '../../components/layout-wrapper/layout-wrapper.component';
import { calculateServicePrice, formatMoney } from '../../utils';
import { getColumnSearchProps } from '../../utils/antd';
import {
  fetchProviderServicesStart,
  removeServiceStart,
} from '../../redux/service/service.actions';

const ServicesPage = ({
  providerId,
  isFetching,
  services,
  onFetchProviderServices,
  onRemoveService,
  history,
}) => {
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

  const removedHandler = (serviceId) => {
    onRemoveService({ serviceId, providerId });
  };

  useEffect(() => {
    onFetchProviderServices(providerId);
  }, [onFetchProviderServices, providerId]);

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
      title: 'Service Type',
      align: 'center',
      render: (_, record) =>
        `${record.typeDetail.typeName} ${record.typeDetail.sectionName}`,
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
    {
      title: 'Update',
      align: 'center',
      render: (_, record) => (
        <Button
          onClick={() =>
            history.push(`/services/${record.id}`, {
              item: record,
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
  ];

  return (
    <LayoutWrapper>
      <Title>
        <h1>Services</h1>
        <Button onClick={() => history.push('/services/add')}>
          Create Service
        </Button>
      </Title>
      <Content>
        <Table
          rowKey="id"
          loading={isFetching}
          dataSource={services}
          rowClassName={(record) =>
            !record.parts.every((part) => !part.isDeleted) ? 'row-warning' : ''
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
      </Content>
    </LayoutWrapper>
  );
};

const mapStateToProps = (state) => ({
  providerId: state.auth.userData?.providerId,
  services: state.services.services,
  isFetching: state.services.isFetching,
});

const mapDispatchToProps = (dispatch) => ({
  onFetchProviderServices: (providerId) =>
    dispatch(fetchProviderServicesStart(providerId)),
  onRemoveService: (id) => dispatch(removeServiceStart(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ServicesPage);
