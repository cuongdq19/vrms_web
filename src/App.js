import React from 'react';
import { Switch } from 'react-router-dom';

import './assets/css/antd.css';
import routes from './routes';

const App = () => {
  return <Switch>{routes}</Switch>;
};

export default App;
