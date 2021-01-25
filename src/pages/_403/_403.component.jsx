import { Button, Result } from 'antd';
import React from 'react';

const _403Page = ({ history }) => {
  return (
    <Result
      status="403"
      title="403"
      subTitle="Sorry, you are not authorized to access this page."
      extra={
        <Button type="primary" onClick={() => history.replace('/')}>
          Back Home
        </Button>
      }
    />
  );
};

export default _403Page;
