import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CRow
} from '@coreui/react'
import { Link } from 'react-router-dom'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router';
import { InputGroup } from 'src/components'

const initial = { givenName: "", familyName: "", cellNo: "", emailAddress: "", loginName: "", roleId: "", phoneNo: "", password: "" };

const Register = () => {
  const history = useHistory();
  const [data, setData] = useState({...initial});
  const [roleOptions, setRoleOptions] = useState([]);
  const [error, setError] = useState(null);

  const register = () => {
    axios.post("/api/auth/register", data)
      .then(() => history.push("login"))
      .catch((e) => {
        if (e.response) {
          setError(e.response.data.message);
        } else {
          setError(e.data ? e.data.message : e.message);
        }
      });
  };

  useEffect(() => axios.get("/api/auth/roles").then((response) => response.data.map(role => ({value: role.id, label: `${role.kdsatker} - ${role.name}`}))).then(setRoleOptions), [])

  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="9" lg="7" xl="6">
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm>
                  <h1>Register</h1>
                  <p className="text-muted">Create your POK Online account</p>
                  <InputGroup className="mb-3" type="text" onChange={(loginName) => setData({...data, loginName})} placeholder="Username" autoComplete="username" iconName="cil-user"/>
                  <InputGroup className="mb-3" type="select" onChange={(roleId) => setData({...data, roleId})} options={roleOptions} placeholder="Satuan Kerja" iconName="cil-industry"/>
                  <InputGroup className="mb-3" type="text" onChange={(givenName) => setData({...data, givenName})} placeholder="Nama Depan" autoComplete="firstName" iconName="cil-user"/>
                  <InputGroup className="mb-3" type="text" onChange={(familyName) => setData({...data, familyName})} placeholder="Nama Belakang" autoComplete="lastName" iconName="cil-user"/>
                  <InputGroup className="mb-3" type="email" onChange={(emailAddress) => setData({...data, emailAddress})} placeholder="Email" autoComplete="email" iconName="cil-envelope-closed"/>
                  <InputGroup className="mb-3" type="phone" onChange={(cellNo) => setData({...data, cellNo})} placeholder="Telepon" autoComplete="phone" iconName="cil-phone"/>
                  <InputGroup className="mb-3" type="password" onChange={(password) => setData({...data, password})} placeholder="Password" iconName="cil-lock-locked"/>
                  <InputGroup className="mb-3" type="password" onChange={(passwordConfirm) => setData({...data, passwordConfirm})} placeholder="Konfirmasi Password" iconName="cil-lock-locked"/>
                  {
                    error && <CAlert color="warning">{error}</CAlert>
                  }
                  <CButton color="primary" onClick={register} block>Register</CButton>
                  <br />
                  <Link to="/login">
                    <CButton color="success" block>Log In</CButton>
                  </Link>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register
