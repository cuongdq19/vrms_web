import React, { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import moment from 'moment';
import { formatMoney, nonAccentVietnamese } from '../../utils';
import { Select } from 'antd';

const AdminProvidersSummaryChart = ({ providers }) => {
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setSelected(providers[0]);
  }, [providers]);

  const { revenues = [] } = selected || {};

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1>Provider Revenue Summary</h1>
        <Select
          showSearch
          filterOption={(input, option) => {
            return (
              nonAccentVietnamese(option.label)
                .toLowerCase()
                .indexOf(nonAccentVietnamese(input.toLowerCase())) >= 0
            );
          }}
          style={{ width: '40%' }}
          value={selected?.id}
          onChange={(value, option) => {
            setSelected(option.item);
          }}
          options={providers.map((p) => ({
            label: p.providerName,
            value: p.id,
            item: p,
          }))}
        />
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={revenues}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="month"
            tickFormatter={(value) =>
              moment(value, 'MM').format('MMMM').slice(0, 3)
            }
          />
          <YAxis
            tickFormatter={(number) => {
              if (number > 1000000000) {
                return (number / 1000000000).toString() + 'B';
              } else if (number > 1000000) {
                return (number / 1000000).toString() + 'M';
              } else if (number > 1000) {
                return (number / 1000).toString() + 'K';
              } else {
                return number.toString();
              }
            }}
          />
          <Tooltip
            formatter={(value) => formatMoney(value)}
            labelFormatter={(label) => moment(label, 'MM').format('MMMM')}
          />
          <Bar
            name="Total Revenue"
            dataKey="totalRevenue"
            stackId="revenue"
            fill="lightblue"
          ></Bar>
          <Bar
            name="Incurred Revenue"
            dataKey="incurredRevenue"
            stackId="revenue"
            fill="salmon"
          ></Bar>
        </BarChart>
      </ResponsiveContainer>
    </>
  );
};

export default AdminProvidersSummaryChart;
