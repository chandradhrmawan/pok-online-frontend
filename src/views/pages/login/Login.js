import CIcon from '@coreui/icons-react'
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow
} from '@coreui/react'
import axios from 'axios'
import React, { useContext, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import SecurityContext from 'src/SecurityContext'
import Bg from '../../../assets/bg_medium.jpeg'
import Logo from '../../../assets/logo_large.png'

const Login = () => {

  const {authorize} = useContext(SecurityContext);
  const [alert, setAlert] = useState();
  const [login, setLogin] = useState({ username: '', password: '' });

  const passwordInput = useRef();

  const doLogin = () => {
    setAlert(null);
    const form = new FormData();
    form.append("username", login.username);
    form.append("password", login.password);
    axios
      .post("/api/auth/login", form)
      .then((r) => authorize(r.data.token))
      .catch((err) => setAlert(err.response ? err.response.data.message : err.message));
  };

  const handleUserKeyDown = (e) => {
    if (e.keyCode === 13) {
      passwordInput.current.focus();
    }
  };

  const handlePassKeyDown = (e) => {
    if (e.keyCode === 13) {
      doLogin();
    }
  };

  return (
    <div className="c-app c-default-layout flex-row align-items-center" style={{backgroundImage: `url(${Bg})`, backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundPosition: "center" }}>
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="8">
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <img src={Logo} alt="Log In" style={{height: 64}} />
                    <p className="text-muted">Sign In to POK Online</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-user" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="text" placeholder="Username" autoComplete="username" onKeyDown={handleUserKeyDown} value={login.username} onChange={e => setLogin({...login, username: e.target.value})} />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-lock-locked" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="password" innerRef={passwordInput} placeholder="Password" autoComplete="current-password" onKeyDown={handlePassKeyDown} value={login.password} onChange={e => setLogin({...login, password: e.target.value})} />
                    </CInputGroup>
                    {
                      alert && <CAlert className="bg-warning">{alert}</CAlert>
                    }
                    <CRow>
                      <CCol xs="6">
                        <CButton color="primary" className="px-4" onClick={doLogin}>Login</CButton>
                      </CCol>
                      <CCol xs="6" className="text-right">
                        <CButton color="link" className="px-0">Forgot password?</CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5 d-md-down-none" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>Daftarkan satuan kerja untuk menggunakan aplikasi POK Online.</p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>Register Now!</CButton>
                    </Link>
                  <small style={{display: "block", marginTop: 36}}>v1.0.1</small>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
