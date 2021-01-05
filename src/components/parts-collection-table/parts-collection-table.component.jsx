import { Select, Table } from 'antd';
import React from 'react';
import { formatMoney, modelToString } from '../../utils';

const PartsCollectionTable = ({
  columns,
  dataSource,
  showDesc = true,
  showModels = true,
}) => {
  return (
    <Table
      rowKey="id"
      dataSource={dataSource}
      columns={[
        { title: 'ID', dataIndex: 'id', align: 'center' },
        { title: 'Name', dataIndex: 'name', align: 'center' },
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

        ...(columns ?? []),
      ]}
    />
  );
};

export default PartsCollectionTable;
