import { Button, Result } from 'antd';
import React from 'react';

const _404Page = ({ history }) => {
  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Button type="primary" onClick={() => history.replace('/')}>
          Back Home
        </Button>
      }
    />
  );
};

export default _404Page;
