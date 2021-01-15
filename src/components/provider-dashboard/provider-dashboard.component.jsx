import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Col, Row, Statistic } from 'antd';
import moment from 'moment';
import { StarFilled } from '@ant-design/icons';

import http from '../../http';
import { Container } from './provider-dashboard.styles';
import { formatMoney } from '../../utils';
import ProviderRevenueChart from '../provider-revenue-chart/provider-revenue-chart.component';
import ProviderRequestChart from '../provider-request-chart/provider-request-chart.component';
import ProviderPartsSummaryTab from '../provider-parts-summary-tab/provider-parts-summary-tab.component';
import ProviderRatingSummaryChart from '../provider-rating-summary-chart/provider-rating-summary-chart.component';

const ProviderDashboard = ({ providerId }) => {
  const currentYear = moment().format('YYYY');
  const currentMonth = moment().format('M');

  const [revenue, setRevenue] = useState([]);
  const [requests, setRequests] = useState([]);
  const [parts, setParts] = useState([]);
  const [ratingSummary, setRatingSummary] = useState([]);
  const [rating, setRating] = useState(-1);

  useEffect(() => {
    Promise.all([
      http.get(`/providers/${providerId}/charts/revenue/${currentYear}`),
      http.get(`/providers/${providerId}/charts/request/${currentYear}`),
      http.get(`/providers/${providerId}`),
      http.get(`/providers/${providerId}/charts/parts/${currentYear}`),
      http.get(`/providers/${providerId}/rating-summary`),
    ]).then(
      ([revenueRes, requestRes, ratingRes, partsRes, ratingSummaryRes]) => {
        setRevenue(revenueRes.data);
        setRequests(requestRes.data);
        setRating(ratingRes.data);
        setParts(partsRes.data);
        setRatingSummary(
          Object.keys(ratingSummaryRes.data).map((key) => ({
            name: +key,
            value: ratingSummaryRes.data[key],
          }))
        );
      }
    );
  }, [providerId, currentYear]);

  console.log(ratingSummary);

  return (
    <>
      <Row gutter={[16, 16]}>
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
          <Container chart>
            <ProviderRevenueChart data={revenue} />
          </Container>
        </Col>
        <Col span={12}>
          <Container chart>
            <ProviderRequestChart data={requests} />
          </Container>
        </Col>
        <Col span={12}>
          <Container chart>
            <ProviderPartsSummaryTab data={parts} />
          </Container>
        </Col>
        <Col span={12}>
          <Container chart>
            <ProviderRatingSummaryChart data={ratingSummary} />
          </Container>
        </Col>
      </Row>
    </>
  );
};

const mapStateToProps = (state) => ({
  providerId: state.auth.userData?.providerId,
});

export default connect(mapStateToProps)(ProviderDashboard);
