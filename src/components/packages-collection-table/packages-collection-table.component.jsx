import { Table } from 'antd';
import React from 'react';
import ServicesCollectionTable from '../services-collection-table/services-collection-table.component';

const PackagesCollectionTable = ({
  dataSource,
  rowKey,
  columns = [],
  servicesExpandedColumns = [],
  partsExpandedColumns = [],
}) => {
  return (
    <Table
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
        ...columns,
      ]}
      expandable={{
        rowExpandable: (record) => record.services.length > 0,
        expandedRowRender: (record) => {
          return (
            <ServicesCollectionTable
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
