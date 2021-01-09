import { notification } from 'antd';
import React from 'react';
import { Switch, withRouter } from 'react-router-dom';

import './assets/css/antd.css';
import { onMessageListener } from './firebase/firebase.utils';

import routes from './routes';
import { getRouteOnNotificationClicked } from './utils/constants';

const App = ({ history }) => {
  onMessageListener()
    .then(({ data, notification: notificationData }) => {
      const { title, body } = notificationData;
      notification.info({
        message: title,
        description: body,
        onClick: () => {
          const action = data.split('_')[0] + '_' + data.split('_')[1];
          const path = getRouteOnNotificationClicked(action);
          history.replace(path);
        },
      });
    })
    .catch((err) => {
      notification.error(JSON.stringify(err));
    });

  return <Switch>{routes}</Switch>;
};

export default withRouter(App);
