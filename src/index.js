import React from 'react';
import ReactDOM from 'react-dom';
import {AppContainer} from 'react-hot-loader';
// AppContainer is a necessary wrapper component for HMR

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import './index.css';
import App from './components/App';

const render = () => {
    ReactDOM.render(
        <AppContainer>
            <MuiThemeProvider>
                <App/>
            </MuiThemeProvider>
        </AppContainer>,
        document.getElementById('app')
    );
};

render();

// Hot Module Replacement API
if (module.hot) {
    module.hot.accept('./components/App', render);
}