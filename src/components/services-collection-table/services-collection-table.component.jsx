import { Table } from 'antd';
import React from 'react';

import PartsCollectionTable from '../parts-collection-table/parts-collection-table.component';

import { formatMoney } from '../../utils';

const ServicesCollectionTable = ({
  size = 'middle',
  rowKey,
  dataSource,
  columns,
  showDefaultQuantity = true,
  partsExpandedColumns,
}) => {
  return (
    <Table
      size={size}
      rowKey={rowKey}
      dataSource={dataSource}
      columns={[
        {
          title: 'ID',
          align: 'center',
          dataIndex: 'id',
          render: (value, record, index) => index + 1,
        },
        { title: 'Service Name', dataIndex: 'name', align: 'center' },
        {
          title: 'Price',
          dataIndex: 'price',
          align: 'center',
          render: (value) => formatMoney(value),
        },
        ...(columns ?? []),
      ]}
      expandable={{
        rowExpandable: (record) => record.parts.length > 0,
        expandedRowRender: (record) => {
          const { id } = record;
          return (
            <PartsCollectionTable
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
    />
  );
};

export default ServicesCollectionTable;
