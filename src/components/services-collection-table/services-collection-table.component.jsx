import { Table } from 'antd';
import React, { useState } from 'react';

import PartsCollectionTable from '../parts-collection-table/parts-collection-table.component';

import { calculateServicePrice, formatMoney } from '../../utils';

import { getColumnSearchProps } from '../../utils/antd';

const ServicesCollectionTable = ({
  loading = false,
  size = 'middle',
  rowKey,
  dataSource,
  columns,
  showDefaultQuantity = true,
  partsExpandedColumns,
  ...rest
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
      rowKey={rowKey}
      dataSource={dataSource}
      columns={[
        {
          title: 'ID',
          align: 'center',
          render: (value, record, index) => index + 1,
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
        ...(columns ?? []),
      ]}
      expandable={{
        rowExpandable: (record) => record.parts.length > 0,
        expandedRowRender: (record) => {
          const { id } = record;
          return (
            <PartsCollectionTable
              rowKey="id"
              showDefaultQuantity={showDefaultQuantity}
              showDesc={false}
              showModels={false}
              dataSource={record.parts.map(
                ({
                  partId,
                  partName,
                  price,
                  quantity,
                  id: servicePartId,
                  ...rest
                }) => ({
                  servicePartId: id,
                  serviceId: id,
                  id: partId,
                  name: partName,
                  price,
                  quantity,
                  ...rest,
                })
              )}
              columns={partsExpandedColumns}
            />
          );
        },
      }}
      {...rest}
    />
  );
};

export default ServicesCollectionTable;
