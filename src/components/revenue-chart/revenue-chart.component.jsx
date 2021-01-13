import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import moment from 'moment';
import { formatMoney } from '../../utils';
const RevenueChart = ({ data }) => {
  return (
    <>
      <h1>Revenue report</h1>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
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
          <Legend />
          <Bar
            name="Parts"
            dataKey="parts"
            stackId="revenue"
            fill="salmon"
          ></Bar>
          <Bar
            name="Services"
            dataKey="services"
            stackId="revenue"
            fill="lightblue"
          ></Bar>
        </BarChart>
      </ResponsiveContainer>
    </>
  );
};

export default RevenueChart;
