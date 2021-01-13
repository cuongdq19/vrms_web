import { Table, Tabs } from 'antd';
import React from 'react';
import moment from 'moment';

const ProviderPartsSummaryTab = ({ data }) => {
  return (
    <>
      <h1>Parts summary report</h1>
      <Tabs>
        {data.map((item) => (
          <Tabs.TabPane
            key={item.month}
            tab={moment(item.month, 'M').format('MMMM')}
          >
            <Table
              rowKey="month"
              dataSource={item.partSummaries}
              columns={[
                {
                  title: 'Rank',
                  align: 'center',
                  render: (_, __, index) => index + 1,
                },
                {
                  title: 'Name',
                  dataIndex: ['part', 'name'],
                  align: 'center',
                },
                {
                  title: 'Count',
                  dataIndex: 'count',
                  align: 'center',
                },
              ]}
            />
          </Tabs.TabPane>
        ))}
      </Tabs>
    </>
  );
};

export default ProviderPartsSummaryTab;
