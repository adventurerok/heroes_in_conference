import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import {BrowserRouter as Router} from 'react-router-dom';
import './index.css';

import 'bootstrap/dist/css/bootstrap.min.css'

import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
    <Router>
        <App />
    </Router>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
