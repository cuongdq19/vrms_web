import { StarFilled } from '@ant-design/icons';
import React from 'react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from 'recharts';

const COLORS = ['#003f5c', '#58508d', '#bc5090', '#ff6361', '#ffa600'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const ProviderRatingSummaryChart = ({ data }) => {
  const isValidValue = data.findIndex((item) => item.value > 0) >= 0;

  return (
    <>
      <h1>Rating Summary</h1>
      {isValidValue ? (
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Legend
              formatter={(value) => (
                <>
                  <span>{value}</span>
                  <StarFilled style={{ color: 'yellow' }} />
                </>
              )}
            />
            <Pie
              cx="50%"
              cy="50%"
              data={data}
              labelLine={false}
              label={renderCustomizedLabel}
              isAnimationActive={false}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <h3>No value to show</h3>
      )}
    </>
  );
};

export default ProviderRatingSummaryChart;
