import { Select, Table } from 'antd';
import React, { useState } from 'react';
import { formatMoney, modelToString } from '../../utils';
import { getColumnSearchProps } from '../../utils/antd';

const PartsCollectionTable = ({
  size = 'middle',
  columns,
  dataSource,
  showDesc = true,
  showModels = true,
  showDefaultQuantity = true,
  loading = false,
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

  return (
    <Table
      loading={loading}
      size={size}
      rowKey="id"
      pagination={{ pageSize: 5 }}
      dataSource={dataSource}
      columns={[
        { title: 'ID', dataIndex: 'id', align: 'center' },
        {
          title: 'Name',
          dataIndex: 'name',
          align: 'center',
          ...getColumnSearchProps('name', handleSearch, handleReset, search),
        },
        { title: 'Category', dataIndex: 'categoryName', align: 'center' },
        ...(showDesc
          ? [
              {
                title: 'Description',
                dataIndex: 'description',
                align: 'center',
                ellipsis: true,
              },
            ]
          : []),
        {
          title: 'Price',
          dataIndex: 'price',
          render: (value) => formatMoney(value),
          align: 'center',
        },
        ...(showModels
          ? [
              {
                title: 'Models',
                align: 'center',
                render: (_, record) => (
                  <Select
                    defaultValue={record.models[0]?.id}
                    options={record.models.map((m) => ({
                      label: modelToString(m),
                      value: m.id,
                    }))}
                  />
                ),
              },
            ]
          : []),
        ...(showDefaultQuantity
          ? [
              { title: 'Quantity', dataIndex: 'quantity', align: 'center' },
              {
                title: 'Total Price',
                align: 'center',
                render: (_, record) =>
                  formatMoney(record.price * record.quantity),
              },
            ]
          : []),
        ...(columns ?? []),
      ]}
    />
  );
};

export default PartsCollectionTable;
