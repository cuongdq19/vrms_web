import React, { useCallback, useEffect, useState } from 'react';
import { Button, message, Popconfirm, Table } from 'antd';
import { connect } from 'react-redux';

import { Content, Title } from './services-collection.styles';
import http from '../../http';
import './services-collection.styles.scss';

import LayoutWrapper from '../../components/layout-wrapper/layout-wrapper.component';
import { calculateServicePrice, formatMoney } from '../../utils';
import { getColumnSearchProps } from '../../utils/antd';

const ServicesCollection = ({ providerId, history }) => {
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
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
    http.delete(`/services/${serviceId}`).then(({ data }) => {
      message.info('Remove service success.');
      loadData();
    });
  };
  const loadData = useCallback(() => {
    setLoading(true);
    http
      .get(`/maintenance-packages/providers/${providerId}/services`)
      .then(({ data }) => {
        setServices(data);
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
  ];

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
        <Table
          rowKey="id"
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
      </Content>
    </LayoutWrapper>
  );
};

const mapStateToProps = (state) => ({
  providerId: state.auth.userData?.providerId,
});

export default connect(mapStateToProps)(ServicesCollection);
