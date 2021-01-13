import { Button, Col, Rate, Row, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import moment from 'moment';

import http from '../../http';
import { formatMoney, roundNumberToHalf } from '../../utils';

const AdminDashboard = () => {
  const currentYear = moment().format('YYYY');
  const currentMonth = moment().format('M');

  //   const currentYear = 2020;
  //   const currentMonth = 12;

  const [providers, setProviders] = useState([]);

  useEffect(() => {
    http.get(`/providers/ratings/${currentYear}`).then(({ data }) => {
      setProviders(
        data.map(({ revenues, ...rest }) => ({
          ...rest,
          revenues: revenues.filter((item) => item.month === currentMonth)[0],
        }))
      );
    });
  }, [currentMonth, currentYear]);

  return (
    <Row>
      <Col span={24}>
        <Table
          dataSource={providers}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          columns={[
            { title: 'ID', dataIndex: 'id', align: 'center' },
            { title: 'Name', dataIndex: 'providerName', align: 'center' },
            {
              title: 'Rating',
              dataIndex: 'ratings',
              align: 'center',
              render: (value) => (
                <Rate disabled allowHalf value={roundNumberToHalf(value)} />
              ),
            },
            {
              title: 'Total Revenue',
              dataIndex: ['revenues', 'totalRevenue'],
              align: 'center',
              render: (value) => formatMoney(value),
            },
            {
              title: 'Incurred Revenue',
              dataIndex: ['revenues', 'incurredRevenue'],
              align: 'center',
              render: (value) => formatMoney(value),
            },
            {
              title: 'Remove',
              align: 'center',
              render: (_, record) => <Button danger>Remove</Button>,
            },
          ]}
        />
      </Col>
    </Row>
  );
};

export default AdminDashboard;
