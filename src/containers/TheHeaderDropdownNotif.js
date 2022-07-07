import CIcon from '@coreui/icons-react'
import {
  CBadge,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle
} from '@coreui/react'
import React, { useContext, useEffect, useState } from 'react'
import SecurityContext from 'src/SecurityContext'

const TheHeaderDropdownNotif = () => {
  const { get } = useContext(SecurityContext);
  const [assignments, setAssignments] = useState([]);

  useEffect(() => get("/api/pok/assignments").then(r => setAssignments(r.data)), [get]);

  return (
    <CDropdown
      inNav
      className="c-header-nav-item mx-2"
    >
      <CDropdownToggle className="c-header-nav-link" caret={false}>
        <CIcon name="cil-bell"/>
        { assignments.length > 0 && <CBadge shape="pill" color="danger">{assignments.length}</CBadge> }
      </CDropdownToggle>
      <CDropdownMenu  placement="bottom-end" className="pt-0">
        <CDropdownItem
          header
          tag="div"
          className="text-center"
          color="light"
        >
          <strong>You have {assignments.length} notifications</strong>
        </CDropdownItem>
        {
          assignments.map(a =>
            <CDropdownItem to={"/pok/details/" + a.revisionId} key={a.revisionId}>
              { a.status === "New" && <CIcon name="cil-file" className="mr-2 text-success" /> }
              { a.status === "Pending Review" && <CIcon name="cil-paper-plane" className="mr-2 text-info" /> }
              { a.status === "Pending Approve" && <CIcon name="cil-people" className="mr-2 text-warning" /> }
              {a.message}
            </CDropdownItem>
          )
        }
      </CDropdownMenu>
    </CDropdown>
  )
}

export default TheHeaderDropdownNotif