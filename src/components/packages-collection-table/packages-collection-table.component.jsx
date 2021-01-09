import { Table } from 'antd';
import React from 'react';
import { calculatePackagePrice, formatMoney } from '../../utils';
import ServicesCollectionTable from '../services-collection-table/services-collection-table.component';

const PackagesCollectionTable = ({
  dataSource,
  rowKey,
  size = 'middle',
  columns = [],
  servicesExpandedColumns = [],
  partsExpandedColumns = [],
  showDefaultQuantity = true,
}) => {
  return (
    <Table
      size={size}
      dataSource={dataSource}
      rowKey={rowKey}
      columns={[
        { title: 'ID', dataIndex: 'id', align: 'center' },
        { title: 'Name', dataIndex: 'name', align: 'center' },
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
        ...columns,
      ]}
      expandable={{
        rowExpandable: (record) => record.services.length > 0,
        expandedRowRender: (record) => {
          return (
            <ServicesCollectionTable
              showDefaultQuantity={showDefaultQuantity}
              dataSource={record.services}
              rowKey="id"
              columns={servicesExpandedColumns}
              partsExpandedColumns={partsExpandedColumns}
            />
          );
        },
      }}
    />
  );
};

export default PackagesCollectionTable;
