import React, { useEffect, useState } from 'react';
import { Button, Rate, Table } from 'antd';
import { connect } from 'react-redux';

import { Content, Title } from './feedbacks.styles';
import LayoutWrapper from '../../components/layout-wrapper/layout-wrapper.component';
import http from '../../http';
import CustomModal from '../../components/custom-modal/custom-modal.component';
import RequestOverview from '../../components/request-overview/request-overview.component';

const FeedbacksPage = ({ providerId }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [visible, setVisible] = useState(false);
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    http.get(`/providers/${providerId}/feedbacks`).then(({ data }) => {
      setFeedbacks(data);
    });
  }, [providerId]);
  return (
    <LayoutWrapper>
      <Title>
        <h1>Feedbacks</h1>
      </Title>
      <Content>
        <Table
          dataSource={feedbacks}
          rowKey="id"
          columns={[
            {
              title: 'ID',
              dataIndex: 'id',
              align: 'center',
            },
            {
              title: 'User Full Name',
              dataIndex: 'fullName',
              align: 'center',
            },
            {
              title: 'Rating',
              dataIndex: 'ratings',
              align: 'center',
              render: (value) => <Rate disabled value={value} />,
            },
            {
              title: 'Content',
              dataIndex: 'content',
              align: 'center',
            },
            {
              title: 'Details',
              dataIndex: 'requestId',
              align: 'center',
              render: (value) => (
                <Button
                  type="primary"
                  onClick={() => {
                    http.get(`/requests/${value}`).then(({ data }) => {
                      setDetail(data);
                      setVisible(true);
                    });
                  }}
                >
                  Details
                </Button>
              ),
            },
          ]}
        />
        <CustomModal
          visible={visible}
          onCancel={() => {
            setVisible(false);
            setDetail(null);
          }}
          onOk={() => {
            setVisible(false);
            setDetail(null);
          }}
        >
          <RequestOverview item={detail} />
        </CustomModal>
      </Content>
    </LayoutWrapper>
  );
};

const mapStateToProps = (state) => ({
  providerId: state.auth.userData?.providerId,
});

export default connect(mapStateToProps)(FeedbacksPage);
