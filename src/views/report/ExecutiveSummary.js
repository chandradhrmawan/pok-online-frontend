import CIcon from '@coreui/icons-react';
import { CButton, CCard, CCardBody, CCardFooter, CCardHeader, CCol, CFormGroup, CLabel, CNav, CNavItem, CNavLink, CTabContent, CTabPane, CTabs } from '@coreui/react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import numeral from 'numeral';
import React, { useContext, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { SelectLocation } from 'src/reusable';
import SecurityContext from 'src/SecurityContext';

const ExecutiveSummary = () => {

    const [session] = useCookies(['access']);
    const { get } = useContext(SecurityContext);
    const [view, setView] = useState("LIST_VERIFIKASI_POK");
    const [rowData, setRowData] = useState([]);
    const [kdlokasi, setKdlokasi] = useState();

    const thousandFormatter = (params) => numeral(params.value).format("0,0");
    const exportView = (e) => window.open(`/api/pok/document?view=${view}&t=${session.access}`, '_blank');


    useEffect(() => {
        if (kdlokasi) {
            get("/api/pok/view-data?view=" + view + "&provinsi=" + kdlokasi)
                .then(response => {
                    setRowData(response.data);
                });
        } else {
            get("/api/pok/view-data?view=" + view)
                .then(response => {
                    setRowData(response.data);
                });
        }
    }, [get, view, kdlokasi]);

    return <>
        <CCard>
            <CCardHeader>Executive Summary</CCardHeader>
            <CCardBody>
                <CFormGroup row>
                    <CCol md="1">
                        <CLabel>Provinsi</CLabel>
                    </CCol>
                    <CCol xs="11" md="5">
                        <SelectLocation onSelect={s => setKdlokasi(s ? s.label : null)} clearable />
                    </CCol>
                </CFormGroup>
                <CTabs activeTab="LIST_VERIFIKASI_POK" onActiveTabChange={setView}>
                    <CNav variant="tabs">
                        <CNavItem>
                            <CNavLink data-tab="LIST_VERIFIKASI_POK">Verifikasi POK</CNavLink>
                        </CNavItem>
                        <CNavItem>
                            <CNavLink data-tab="LIST_UNVERIFIED_POK">Unverified POK</CNavLink>
                        </CNavItem>
                        <CNavItem>
                            <CNavLink data-tab="LIST_UNAPPROVED_POK">Unapproved POK</CNavLink>
                        </CNavItem>
                        <CNavItem>
                            <CNavLink data-tab="LIST_UNAPPROVED_KOORDINAT">Unapproved Koordinat</CNavLink>
                        </CNavItem>
                    </CNav>
                    <CTabContent>
                        <CTabPane data-tab="LIST_VERIFIKASI_POK">
                            <div className="ag-theme-balham" style={{ height: 550 }}>
                                <AgGridReact rowData={rowData} defaultColDef={{ width: 100, resizable: true, }}>
                                    <AgGridColumn field="NOPROP" headerName="NOPROP" />
                                    <AgGridColumn field="PROVINSI" headerName="PROVINSI" />
                                    <AgGridColumn field="SATKER" headerName="SATKER" />
                                    <AgGridColumn field="STATUS_REVISI" headerName="STATUS REVISI" />
                                    <AgGridColumn field="STATUS_POK" headerName="STATUS POK" />
                                    <AgGridColumn field="CREATED_DATE" headerName="CREATED DATE" />
                                    <AgGridColumn field="APPROVER_1" headerName="APPROVER 1" />
                                    <AgGridColumn field="APPROVED_DATE_1" headerName="APPROVED DATE 1" />
                                    <AgGridColumn field="APPROVER_2" headerName="APPROVER 2" />
                                    <AgGridColumn field="APPROVED_DATE_2" headerName="APPROVED DATE 2" />
                                    <AgGridColumn field="APPROVER_3" headerName="APPROVER 3" />
                                    <AgGridColumn field="APPROVED_DATE_3" headerName="APPROVED DATE 3" />
                                </AgGridReact>
                            </div>
                        </CTabPane>
                        <CTabPane data-tab="LIST_UNVERIFIED_POK">
                            <div className="ag-theme-balham" style={{ height: 550 }}>
                                <AgGridReact rowData={rowData} defaultColDef={{ width: 100, resizable: true, }}>
                                    <AgGridColumn field="NOPROP" headerName="NOPROP" />
                                    <AgGridColumn field="PROVINSI" headerName="PROVINSI" />
                                    <AgGridColumn field="SATKER" headerName="SATKER" />
                                    <AgGridColumn field="STATUS_REVISI" headerName="STATUS REVISI" />
                                    <AgGridColumn field="STATUS_POK" headerName="STATUS POK" />
                                    <AgGridColumn field="CREATED_DATE" headerName="CREATED DATE" />
                                    <AgGridColumn field="APPROVER_1" headerName="APPROVER 1" />
                                    <AgGridColumn field="APPROVED_DATE_1" headerName="APPROVED DATE 1" />
                                    <AgGridColumn field="APPROVER_2" headerName="APPROVER 2" />
                                    <AgGridColumn field="APPROVED_DATE_2" headerName="APPROVED DATE 2" />
                                    <AgGridColumn field="APPROVER_3" headerName="APPROVER 3" />
                                    <AgGridColumn field="APPROVED_DATE_3" headerName="APPROVED DATE 3" />
                                </AgGridReact>
                            </div>
                        </CTabPane>
                        <CTabPane data-tab="LIST_UNAPPROVED_POK">
                            <div className="ag-theme-balham" style={{ height: 550 }}>
                                <AgGridReact rowData={rowData} defaultColDef={{ width: 100, resizable: true, }}>
                                    <AgGridColumn field="NOPROP" headerName="NOPROP" />
                                    <AgGridColumn field="PROVINSI" headerName="PROVINSI" />
                                    <AgGridColumn field="SATKER" headerName="SATKER" />
                                    <AgGridColumn field="TAHUN_ANGGARAN" headerName="TAHUN ANGGARAN" />
                                    <AgGridColumn field="SEMESTER" headerName="SEMESTER" />
                                    <AgGridColumn field="STATUS_DATA" headerName="STATUS DATA" />
                                    <AgGridColumn field="STATUS_POK" headerName="STATUS POK" />
                                    <AgGridColumn field="STATUS_KOORDINAT" headerName="STATUS KOORDINAT" />
                                    <AgGridColumn field="LATEST_IND" headerName="LATEST" />
                                    <AgGridColumn field="ALOKASI_DANA" headerName="ALOKASI DANA" type="rightAligned" valueFormatter={thousandFormatter} />
                                    <AgGridColumn field="CREATED_DATE" headerName="CREATED DATE" />
                                    <AgGridColumn field="APPROVED_DATE" headerName="APPROVED DATE" />
                                    <AgGridColumn field="OWNER" headerName="OWNER" />
                                </AgGridReact>
                            </div>
                        </CTabPane>
                        <CTabPane data-tab="LIST_UNAPPROVED_KOORDINAT">
                            <div className="ag-theme-balham" style={{ height: 550 }}>
                                <AgGridReact rowData={rowData} defaultColDef={{ width: 100, resizable: true, }}>
                                    <AgGridColumn field="NOPROP" headerName="NOPROP"/>
                                    <AgGridColumn field="PROVINSI" headerName="PROVINSI"/>
                                    <AgGridColumn field="SATKER" headerName="SATKER"/>
                                    <AgGridColumn field="TAHUN_ANGGARAN" headerName="TAHUN ANGGARAN"/>
                                    <AgGridColumn field="DS_STATUS" headerName="DS STATUS"/>
                                    <AgGridColumn field="SEMESTER" headerName="SEMESTER"/>
                                    <AgGridColumn field="STATUS_KOORDINAT" headerName="STATUS KOORDINAT"/>
                                    <AgGridColumn field="STATUS_POK" headerName="STATUS POK"/>
                                    <AgGridColumn field="OWNER" headerName="OWNER"/>
                                    <AgGridColumn field="CREATED_DATE" headerName="CREATED DATE"/>
                                    <AgGridColumn field="CHANGED_DATE" headerName="CHANGED DATE"/>
                                    <AgGridColumn field="APPROVED_BALAI_DATE" headerName="APPROVED BALAI DATE"/>
                                    <AgGridColumn field="UPLOAD_DATE" headerName="UPLOAD DATE"/>
                                    <AgGridColumn field="APPROVED_DATE" headerName="APPROVED DATE"/>
                                    <AgGridColumn field="UPLOADED_STATUS" headerName="UPLOADED STATUS"/>
                                </AgGridReact>
                            </div>
                        </CTabPane>
                    </CTabContent>
                </CTabs>
            </CCardBody>
            <CCardFooter className="text-right">
                <CButton color="primary" onClick={exportView}><CIcon size="sm" name="cil-arrow-thick-to-bottom" /> PDF</CButton>
            </CCardFooter>
        </CCard>
    </>

};

export default ExecutiveSummary;
