import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Col, Row, Statistic, Table, Tabs } from 'antd';

import http from '../../http';
import LayoutWrapper from '../../components/layout-wrapper/layout-wrapper.component';
import { formatMoney } from '../../utils';
import { Container } from './dashboard.styles';
import RequestChart from '../../components/request-chart/request-chart.component';
import RevenueChart from '../../components/revenue-chart/revenue-chart.component';
import { StarFilled } from '@ant-design/icons';

const DashboardPage = ({ providerId }) => {
  const currentYear = moment().format('YYYY');
  const currentMonth = moment().format('M');

  const [revenue, setRevenue] = useState([]);
  const [requests, setRequests] = useState([]);
  const [parts, setParts] = useState([]);
  const [rating, setRating] = useState(-1);

  useEffect(() => {
    Promise.all([
      http.get(`/providers/${providerId}/charts/revenue/${currentYear}`),
      http.get(`/providers/${providerId}/charts/request/${currentYear}`),
      http.get(`/providers/${providerId}`),
      http.get(`/providers/${providerId}/charts/parts/${currentYear}`),
    ]).then(([revenueRes, requestRes, ratingRes, partsRes]) => {
      setRevenue(revenueRes.data);
      setRequests(requestRes.data);
      setRating(ratingRes.data);
      setParts(partsRes.data);
    });
  }, [providerId, currentYear]);

  return (
    <LayoutWrapper>
      <Row justify="space-between" gutter={[16, 16]}>
        <Col span={6}>
          <Container>
            <Statistic
              title="Revenue"
              value={formatMoney(
                revenue.find(
                  (revenue) =>
                    revenue.month.toString() === currentMonth.toString()
                )?.total
              )}
            />
          </Container>
        </Col>
        <Col span={6}>
          <Container>
            <Statistic
              title="Requests"
              value={
                requests.find(
                  (request) =>
                    request.month.toString() === currentMonth.toString()
                )?.total
              }
            />
          </Container>
        </Col>
        <Col span={6}>
          <Container>
            <Statistic
              title="Rating"
              prefix={<StarFilled style={{ color: 'yellow' }} />}
              value={rating >= 0 ? rating : 'No Rating'}
            />
          </Container>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Container>
            <RevenueChart data={revenue} />
          </Container>
        </Col>
        <Col span={12}>
          <Container>
            <RequestChart data={requests} />
          </Container>
        </Col>
        <Col span={24}>
          <Container>
            <h1>Parts summary report</h1>
            <Tabs>
              {parts.map((item) => (
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
          </Container>
        </Col>
      </Row>
    </LayoutWrapper>
  );
};

const mapStateToProps = (state) => ({
  providerId: state.auth.userData?.providerId,
});

export default connect(mapStateToProps)(DashboardPage);
