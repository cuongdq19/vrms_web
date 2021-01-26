import { Col, Rate, Row, Statistic, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import _ from 'lodash';

import http from '../../http';
import { Container } from './admin-dashboard.styles';
import { roundNumberToHalf } from '../../utils';
import AdminProvidersSummaryChart from '../admin-providers-summary-chart/admin-providers-summary-chart.component';
import LoadingSpinner from '../loading-spinner/loading-spinner.component';

const AdminDashboard = () => {
  const currentYear = moment().format('YYYY');
  const currentMonth = moment().format('M');

  //   const currentYear = 2020;
  //   const currentMonth = 12;

  const [loading, setLoading] = useState(false);
  const [providers, setProviders] = useState([]);
  const [requestRatio, setRequestRatio] = useState(null);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalProviders, setTotalProviders] = useState(0);
  const [totalRequests, setTotalRequests] = useState(0);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      http.get(`/providers/ratings/${currentYear}`),
      http.get('/providers/customers'),
      http.get('/providers/new'),
      http.get('/providers/requests/summary'),
      http.get('/providers/requests/summary/ratio'),
    ]).then(
      ([
        providersRes,
        customersRes,
        totalProvidersRes,
        totalRequestsRes,
        requestSummaryRes,
      ]) => {
        setLoading(false);
        setProviders(providersRes.data);
        setRequestRatio(
          requestSummaryRes.data.find(
            (item) => item.month.toString() === currentMonth.toString()
          )
        );
        setTotalCustomers(customersRes.data[currentMonth]);
        setTotalProviders(totalProvidersRes.data[currentMonth]);
        setTotalRequests(totalRequestsRes.data[currentMonth]);
      }
    );
  }, [currentMonth, currentYear]);

  if (loading) {
    return <LoadingSpinner title="Loading ..." />;
  }

  return (
    <Row gutter={[16, 16]}>
      <Col span={6}>
        <Container chart={false}>
          <Statistic title="Total Providers" value={totalProviders} />
        </Container>
      </Col>
      <Col span={6}>
        <Container chart={false}>
          <Statistic title="Total Customers" value={totalCustomers} />
        </Container>
      </Col>
      <Col span={6}>
        <Container chart={false}>
          <Statistic title="Total Requests" value={totalRequests} />
        </Container>
      </Col>
      <Col span={6}>
        <Container chart={false}>
          <Statistic
            title="Canceled Ratio"
            value={
              (requestRatio?.totalRequest > 0
                ? _.round(
                    requestRatio?.canceledRequest / requestRatio?.totalRequest,
                    1
                  )
                : 0) *
                100 +
              '%'
            }
          />
        </Container>
      </Col>
      <Col span={12}>
        <Container chart>
          <h1>Providers Summary</h1>
          <Table
            pagination={{ pageSize: 5 }}
            dataSource={providers}
            rowKey="id"
            columns={[
              {
                title: 'Rank',
                align: 'center',
                render: (__, record, index) => index + 1,
              },
              {
                title: 'Provider Name',
                align: 'center',
                dataIndex: 'providerName',
              },
              {
                title: 'Provider Name',
                align: 'center',
                dataIndex: 'providerName',
              },
              {
                title: 'Rating',
                dataIndex: 'ratings',
                align: 'center',
                sorter: (a, b) => b.ratings - a.ratings,
                render: (value) => (
                  <Rate disabled allowHalf value={roundNumberToHalf(value)} />
                ),
              },
              {
                title: 'Incurred Ratio',
                align: 'center',
                sorter: (a, b) => {
                  const aItem = a.revenues.find(
                    (item) => item.month.toString() === currentMonth.toString()
                  );
                  const aRatio =
                    aItem.totalRevenue === 0
                      ? 0
                      : _.round(aItem.incurredRevenue / aItem.totalRevenue, 2);
                  const bItem = b.revenues.find(
                    (item) => item.month.toString() === currentMonth.toString()
                  );
                  const bRatio =
                    bItem.totalRevenue === 0
                      ? 0
                      : _.round(bItem.incurredRevenue / bItem.totalRevenue, 2);
                  return bRatio - aRatio;
                },
                render: (__, record) => {
                  const revenueMonth = record.revenues.find(
                    (item) => item.month.toString() === currentMonth.toString()
                  );
                  if (revenueMonth.incurredRevenue === 0) {
                    return '0%';
                  }
                  return (
                    _.round(
                      revenueMonth.incurredRevenue / revenueMonth.totalRevenue,
                      2
                    ) + '%'
                  );
                },
              },
            ]}
          />
        </Container>
      </Col>
      <Col span={12}>
        <Container chart>
          <AdminProvidersSummaryChart providers={providers} />
        </Container>
      </Col>
    </Row>
  );
};

export default AdminDashboard;
