import { Table } from 'antd';
import React from 'react';

import PartsCollectionTable from '../parts-collection-table/parts-collection-table.component';

import { calculateServicePrice, formatMoney } from '../../utils';

const ServicesCollectionTable = ({
  loading = false,
  size = 'middle',
  rowKey,
  dataSource,
  columns,
  showDefaultQuantity = true,
  partsExpandedColumns,
}) => {
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
        { title: 'Service Name', dataIndex: 'name', align: 'center' },
        // {
        //   align: 'center',
        //   title: 'Service Type',
        //   render: (_, record) => {
        //     console.log(record);
        //     return `${
        //       record.typeDetail.typeName
        //     } ${record.typeDetail.sectionName.toLowerCase()}`;
        //   },
        // },
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
    />
  );
};

export default ServicesCollectionTable;
