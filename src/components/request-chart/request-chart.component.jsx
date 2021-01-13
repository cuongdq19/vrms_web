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

const RequestChart = ({ data }) => {
  return (
    <>
      <h1>Booking report</h1>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            tickFormatter={(value) =>
              moment(value, 'MM').format('MMMM').slice(0, 3)
            }
          />
          <YAxis />
          <Tooltip
            labelFormatter={(label) => moment(label, 'MM').format('MMMM')}
          />
          <Legend />
          <Bar
            name="Canceled"
            dataKey="canceled"
            stackId="requests"
            fill="salmon"
          ></Bar>
          <Bar
            name="Not canceled"
            dataKey={(data) => data.total - data.canceled}
            stackId="requests"
            fill="lightblue"
          ></Bar>
        </BarChart>
      </ResponsiveContainer>
    </>
  );
};

export default RequestChart;
