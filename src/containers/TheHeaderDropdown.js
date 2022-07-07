import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CDropdown,
  CDropdownMenu,
  CDropdownToggle
} from '@coreui/react'
import React, { useContext, useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import SecurityContext from 'src/SecurityContext'

const TheHeaderDropdown = () => {
  const { setAuthenticated, user } = useContext(SecurityContext);
  const [avatar, setAvatar] = useState();
  const [session, setSession, removeSession] = useCookies(['access']); // eslint-disable-line no-unused-vars

  const logout = () => {
    removeSession("access");
    setAuthenticated(false);
  };


  useEffect(() => {
    if (user) {
      setAvatar(user.name.split(' ').map(n => n[0]).reduce((a, b) => a + b));
    }
  }, [user])

  return (
    <CDropdown
      inNav
      className="c-header-nav-items mx-2"
      direction="down"
    >
      <CDropdownToggle className="c-header-nav-link" caret={false}>
        <div className="c-avatar bg-gradient-primary text-white text-value-md">
          {avatar}
        </div>
      </CDropdownToggle>
      <CDropdownMenu className="p-0" placement="bottom-end">
        <CCard className="m-0" style={{ width: 300 }}>
          <CCardBody className="text-center">
            <div className="c-avatar c-avatar-xl bg-gradient-primary text-white text-value-md mb-2">
              {avatar}
            </div>
            {user &&
              <>
                <p className="font-md font-weight-bold">{user.name}</p>
                <p className="font-sm font-italic">{user.permissions.map(p => <span key={p.id} className="badge badge-light mr-1">{p.name}</span>)}</p>
                <p className="font-sm font-italic">{user.roles.map(r => <span key={r.id} className="text-muted">{r.name}</span>)}</p>
              </>
            }
          </CCardBody>
          <CCardFooter className="text-center">
            <CButton color="primary" className="mr-2" to="/user/profile">Profile</CButton>
            <CButton color="danger" onClick={logout}>Log Out</CButton>
          </CCardFooter>
        </CCard>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default TheHeaderDropdown
