import { notification } from 'antd';
import React from 'react';
import { Switch } from 'react-router-dom';

import './assets/css/antd.css';
import { onMessageListener } from './firebase/firebase.utils';

import routes from './routes';

const App = () => {
  onMessageListener()
    .then(({ data, notification }) => {
      const { title, body } = notification;
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

export default App;
