import {
  CCol, CRow, CWidgetIcon
} from '@coreui/react'
import React from 'react'

const WidgetsDropdown = ({summary}) => {
  
  // render
  return (
    <CRow>

      <CCol sm="6" lg="3">
        <CWidgetIcon
          color="gradient-primary"
          text="Total POK"
        >
          <span className="h4">{summary.total}</span>
        </CWidgetIcon>
      </CCol>

      <CCol sm="6" lg="3">
        <CWidgetIcon
          color="gradient-info"
          text="POK Usulan"
        >
          <span className="h4">{summary.proposed}</span>
        </CWidgetIcon>
      </CCol>

      <CCol sm="6" lg="3">
        <CWidgetIcon
          color="gradient-warning"
          text="POK Revisi"
        >
          <span className="h4">{summary.revised}</span>
        </CWidgetIcon>
      </CCol>

      <CCol sm="6" lg="3">
        <CWidgetIcon
          color="gradient-danger"
          text="POK Disetujui"
        >
          <span className="h4">{summary.approved}</span>
        </CWidgetIcon>
      </CCol>

    </CRow>
  )
}

export default WidgetsDropdown
