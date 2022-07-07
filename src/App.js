import React, { useEffect, useState } from 'react';
import { CookiesProvider, useCookies } from 'react-cookie';
import 'react-datepicker/dist/react-datepicker.css';
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import './scss/style.scss';
import SecurityContext from './SecurityContext';
import axios from 'axios';

const http = axios.create();

let tasks = 0;

const showLoading = () => {
  document.getElementById("loading-state").style.display = "flex";
}

const hideLoading = () => {
  document.getElementById("loading-state").style.display = "none";
}

http.interceptors.request.use((r) => {
  ++tasks;
  if (tasks > 0) {
    showLoading();
  }
  return r;
});

http.interceptors.response.use((r) => {
  --tasks;
  if (tasks <= 0) {
    tasks = 0;
    hideLoading();
  }

  return r;
}, (e) => {
  --tasks;
  if (tasks <= 0) {
    tasks = 0;
    hideLoading();
  }

  return Promise.reject(e);
});

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const TheLayout = React.lazy(() => import('./containers/TheLayout'));

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'));
const Register = React.lazy(() => import('./views/pages/register/Register'));
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'));
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'));

const App = () => {

  const [authenticated, setAuthenticated] = useState(false);
  const [session, setSession] = useCookies(['access']);
  const [user, setUser] = useState({});
  const get = (path) => http.get(path, { headers: { Authorization: `Bearer ${session.access}` } })
  .catch(e => {
    if (e.response && e.response.data) {
      toast(
        <div>
          <strong style={{color: "orange"}}>System Error</strong>
          <br />
          <br />
          <small>{e.response.data.message}</small>
        </div>
      );
    } else {
      toast(
        <div>
          <strong style={{color: "orange"}}>Request Failed</strong>
          <br />
          <br />
          <small>{e.message}</small>
        </div>
      );
    }
    return Promise.reject(e);
  });
  const post = (path, data) => http.post(path, data, { headers: { Authorization: `Bearer ${session.access}` } })
    .catch(e => {
      if (e.response && e.response.data) {
        toast(
          <div>
            <strong style={{color: "orange"}}>System Error</strong>
            <br />
            <br />
            <small>{e.response.data.message}</small>
          </div>
        );
      } else {
        toast(
          <div>
            <strong style={{color: "orange"}}>Request Failed</strong>
            <br />
            <br />
            <small>{e.message}</small>
          </div>
        );
      }
      return Promise.reject(e);
    });
  const authorize = (token) => setSession('access', token);

  useEffect(() => {
    if (session.access) {
      http.get("/api/user/authenticated", { headers: { Authorization: `Bearer ${session.access}` } })
        .then(response => {
          setUser(response.data);
          setAuthenticated(true);
        });
    }
  }, [session]);

  return (
    <HashRouter>
      <React.Suspense fallback={loading}>
        <CookiesProvider>
          <SecurityContext.Provider value={{ authenticated, setAuthenticated, authorize, user, get, post }}>
            <Switch>
              <Route exact path="/login" name="Login Page" render={props => authenticated ? <Redirect to="/" /> : <Login {...props} />} />
              <Route exact path="/register" name="Register Page" render={props => <Register {...props} />} />
              <Route exact path="/404" name="Page 404" render={props => <Page404 {...props} />} />
              <Route exact path="/500" name="Page 500" render={props => <Page500 {...props} />} />
              <Route path="/" name="Home" render={props => authenticated ? <TheLayout {...props} /> : <Redirect to="/login" />} />
            </Switch>
            <Toaster />
          </SecurityContext.Provider>
        </CookiesProvider>
      </React.Suspense>
    </HashRouter>
  );
}

export default App;
