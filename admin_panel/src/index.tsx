import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import {BrowserRouter as Router} from 'react-router-dom';
import './index.css';

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min'

import registerServiceWorker from './registerServiceWorker';
import {Provider} from "react-redux";
import {appStore} from "./store/appStore";

const devMode = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

const baseName = devMode ? undefined : "/admin/";

ReactDOM.render(
    <Provider store={appStore}>
        <Router basename={baseName}>
            <App/>
        </Router>
    </Provider>,
    document.getElementById('root') as HTMLElement
);
registerServiceWorker();
