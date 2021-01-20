import { notification } from 'antd';
import React from 'react';
import { Switch, withRouter } from 'react-router-dom';

import './assets/css/antd.css';
import { onMessageListener } from './firebase/firebase.utils';

import routes from './routes';

const App = ({ history }) => {
  onMessageListener()
    .then(({ data, notification: notificationData }) => {
      const { title, body } = notificationData;
      notification.info({
        message: title,
        description: body,
      });
    })
    .catch((err) => {
      notification.error(JSON.stringify(err));
    });

  return <Switch>{routes}</Switch>;
};

export default withRouter(App);
