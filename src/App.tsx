import './App.css';
import './styles/index.less';
import './index.less';

import { ConfigProvider } from 'antd';
import enUs from 'antd/lib/locale/en_US';
import { loadCss, setDefaultOptions } from 'esri-loader';
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { ReactReduxFirebaseProvider } from 'react-redux-firebase';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Header from './components/Header';
import LanguageProvider from './components/LanguageProvider';
import SpaceSelectPage from './pages/SpaceSelectPage';
import { rrfProps, store } from './redux/store';
import SpaceDetailsRouter from './routers/SpaceDetailsRouter';
import {
  URL_CREATE_SPACE,
  URL_LANDING,
  URL_LOGIN,
  URL_SIGNUP,
  URL_SPACE_DETAILS,
  URL_SPACES,
} from './urls';
import CreateSpacePage from './pages/CreateSpacePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import PrivateRoute from './components/PrivateRoute';
import LandingPage from './pages/LandingPage';

import './styles/index.less';

// before loading the modules for the first time,
// also lazy load the CSS for the version of
// the script that you're loading from the CDN
setDefaultOptions({ css: true });

loadCss();

function App() {
  return (
    <ConfigProvider locale={enUs}>
      <Provider store={store}>
        <LanguageProvider>
          <ReactReduxFirebaseProvider {...rrfProps}>
            <Header />
            <BrowserRouter>
              <Switch>
                <Route path={URL_LOGIN} component={LoginPage} />
                <Route path={URL_SIGNUP} component={SignupPage} />
                <PrivateRoute path={URL_CREATE_SPACE} exact>
                  <CreateSpacePage />
                </PrivateRoute>
                <PrivateRoute path={URL_SPACES} exact>
                  <SpaceSelectPage />
                </PrivateRoute>
                <PrivateRoute path={URL_SPACE_DETAILS}>
                  <SpaceDetailsRouter />
                </PrivateRoute>
                <Route path={URL_LANDING} component={LandingPage} />
              </Switch>
            </BrowserRouter>
          </ReactReduxFirebaseProvider>
        </LanguageProvider>
      </Provider>
    </ConfigProvider>
  );
}

export default App;
