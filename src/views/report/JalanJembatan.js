import React, { useContext, useEffect, useState } from 'react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { CButton, CCard, CCardBody, CCardFooter, CCardHeader, CCol, CFormGroup, CInput, CInputGroup, CInputGroupAppend, CLabel, CNav, CNavItem, CNavLink, CTabContent, CTabPane, CTabs } from '@coreui/react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import { SelectLocation } from 'src/reusable';
import SecurityContext from 'src/SecurityContext';
import CIcon from '@coreui/icons-react';
import numeral from 'numeral';
import { useCookies } from 'react-cookie';

const JalanJembatan = () => {

    const [session] = useCookies(['access']);
    const { get } = useContext(SecurityContext);
    const [view, setView] = useState("RUAS_JALAN");
    const [rowJalan, setRowJalan] = useState([]);
    const [rowJembatan, setRowJembatan] = useState([]);
    const [filter, setFilter] = useState({});
    const [kdlokasi, setKdlokasi] = useState();

    const thousandFormatter = (params) => numeral(params.value).format("0,0");
    const exportView = (e) => window.open(`/api/pok/document?view=${view}&kdlokasi=${kdlokasi}&t=${session.access}`, '_blank');

    useEffect(() => {
        if (kdlokasi) {
            if (view === 'RUAS_JALAN') {
                get("/api/pok/view-data?view=RUAS_JALAN&kdlokasi=" + kdlokasi)
                    .then(response => {
                        setRowJalan(response.data);
                    });
            } else {
                get("/api/pok/view-data?view=RUAS_JEMBATAN&kdlokasi=" + kdlokasi)
                    .then(response => {
                        setRowJembatan(response.data);
                    });
            }
        }
    }, [get, view, filter, kdlokasi]);
    return <>
        <CCard>
            <CCardHeader>Ruas Jalan &amp; Jembatan</CCardHeader>
            <CCardBody>
                <CFormGroup row>
                    <CCol md="1">
                        <CLabel>Provinsi</CLabel>
                    </CCol>
                    <CCol xs="11" md="5">
                        <SelectLocation onSelect={s => setKdlokasi(s.value)} />
                    </CCol>
                </CFormGroup>
                <CFormGroup row>
                    <CCol md="1">
                        <CLabel>Pencarian</CLabel>
                    </CCol>
                    <CCol xs="11" md="5">
                        <CInputGroup>
                            <CInput placeholder="Nomor / Provinsi / Linkname" onChange={s => setFilter({keyword: s})} />
                            <CInputGroupAppend>
                                <CButton color="secondary"><CIcon name="cil-magnifying-glass" size="sm" /> Cari</CButton>
                            </CInputGroupAppend>
                        </CInputGroup>
                    </CCol>
                </CFormGroup>
                <CTabs activeTab="RUAS_JALAN" onActiveTabChange={setView}>
                    <CNav variant="tabs">
                        <CNavItem>
                            <CNavLink data-tab="RUAS_JALAN">Ruas Jalan</CNavLink>
                        </CNavItem>
                        <CNavItem>
                            <CNavLink data-tab="RUAS_JEMBATAN">Ruas Jembatan</CNavLink>
                        </CNavItem>
                    </CNav>
                    <CTabContent>
                        <CTabPane data-tab="RUAS_JALAN">
                            <div className="ag-theme-balham" style={{ height: 550 }}>
                                <AgGridReact rowData={rowJalan} defaultColDef={{width: 100}}>
                                    <AgGridColumn field="RUAS" headerName="Ruas"/>
                                    <AgGridColumn field="SFFX" headerName="Sfx"/>
                                    <AgGridColumn field="KOTA" headerName="Kota" width={300}/>
                                    <AgGridColumn field="RUAS1" headerName="Ruas1"/>
                                    <AgGridColumn field="SFFX1" headerName="Sfx1"/>
                                    <AgGridColumn field="KOTA1" headerName="Kota1" width={300}/>
                                    <AgGridColumn field="LINKNAME" headerName="Linkname" width={300}/>
                                    <AgGridColumn field="LENGTH" headerName="Length (Km)" type="rightAligned"/>
                                    <AgGridColumn field="LEBAR" headerName="Lebar (M)" type="rightAligned"/>
                                    <AgGridColumn field="KPFROM" headerName="Kpfrom" type="rightAligned" valueFormatter={thousandFormatter}/>
                                    <AgGridColumn field="KPTO" headerName="Kpto" type="rightAligned" valueFormatter={thousandFormatter}/>
                                    <AgGridColumn field="FRORGN" headerName="Frorgn"/>
                                    <AgGridColumn field="FCTCLASS" headerName="Fctclass"/>
                                </AgGridReact>
                            </div>
                        </CTabPane>
                        <CTabPane data-tab="RUAS_JEMBATAN">
                            <div className="ag-theme-balham" style={{ height: 550 }}>
                                <AgGridReact rowData={rowJembatan} defaultColDef={{width: 100}}>
                                    <AgGridColumn field="NOMOR" headerName="Nomor"/>
                                    <AgGridColumn field="SUFFIX" headerName="Suffix"/>
                                    <AgGridColumn field="NAMA" headerName="Nama" width={300}/>
                                    <AgGridColumn field="PANJANG" headerName="Panjang (M)" type="rightAligned"/>
                                    <AgGridColumn field="RUAS1" headerName="Ruas1"/>
                                    <AgGridColumn field="SFFX1" headerName="Sffx1"/>
                                    <AgGridColumn field="LINKNAME" headerName="LinkName" width={300}/>
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

export default JalanJembatan;
