import CIcon from "@coreui/icons-react";
import { CButton, CCard, CCardBody, CCardHeader, CCol, CFormGroup, CInputRadio, CLabel, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CRow, CInputGroupText, CInputGroup, CInputGroupPrepend } from "@coreui/react";
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import React, { useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import ReactDatePicker from "react-datepicker";
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import { useHistory } from "react-router";
import { SelectOfficer } from "src/reusable";
import PdfViewer from "src/reusable/PdfViewer";
import SelectDataStatus from "src/reusable/SelectDataStatus";
import SecurityContext from "src/SecurityContext";
import PokHeader from "./PokHeader";
import PokInfo from "./PokInfo";
import numeral from "numeral";

const PreCell = (props) => {
    const cellValue = props.valueFormatted ? props.valueFormatted : props.value;
    return <>
        <pre>{cellValue}</pre>
    </>
}

const PokDetails = ({ match }) => {
    const history = useHistory();
    const [session] = useCookies(['access']);
    const { get } = useContext(SecurityContext);
    const [revision, setRevision] = useState({});
    const [tableData, setTableData] = useState([]);
    const [tableData2, setTableData2] = useState([]);
    const [currentView, setCurrentView] = useState("RENCANA_KERJA");
    const [viewParams, setViewParams] = useState("");
    const [showView, setShowView] = useState(false);
    const [reportDate, setReportDate] = useState(new Date());
    const [officer, setOfficer] = useState({});
    const [officerCategory, setOfficerCategory] = useState("PUSAT");
    const [histories, setHistories] = useState([]);

    const [filter, setFilter] = useState({ level: "satker", first_status: "0", second_status: null, periode: "0" });

    const onViewChange = (e) => setCurrentView(e.target.value);
    const doShowView = (e) => setShowView(true);
    const exportView = (e) => window.open(`/api/pok/document?t=${session.access}&${viewParams}&officerId=${officer.value}`, '_blank');
    const exportViewSpr = (e) => window.open(`/api/pok/spreadsheet?t=${session.access}&${viewParams}&officerId=${officer.value}`, '_blank');

    const thousandFormatter = (params) => numeral(params.value).format("0,0");

    const rowClassRules = {
        'grid-row-bold': (params) => params.data.BOLD === 'Y',
    };

    const defaultColDef = {
        resizable: true,
        width: 80,
    };

    useEffect(() => {
        setTableData([]);
        if (showView && currentView) {


            let filterQuery = "";

            Object.keys(filter)
                .filter(a => filter[a] !== null)
                .forEach(a => filterQuery += `&${a}=${filter[a]}`);

            if (!['LAMPIRAN', 'SURAT_PENGANTAR'].includes(currentView)) {

                get(`/api/pok/view-data?id=${match.params.id}&view=${currentView}&${filterQuery}`)
                    .then(response => {
                        setTableData(response.data);
                    });

                if (currentView === "CHECKLIST") {
                    get(`/api/pok/view-data?id=${match.params.id}&view=CHECKLIST_PEN_RO&${filterQuery}`)
                        .then(response => {
                            setTableData2(response.data);
                        });
                } else {
                    setTableData2([]);
                }
                
            }

            setViewParams(`id=${match.params.id}&view=${currentView}&${filterQuery}`);
        }
    }, [get, showView, currentView, match, filter]);

    return <>
        <CRow>
            <CCol>
                <PokInfo
                    uid={match.params.id}
                    onLoaded={
                        (r, h) => {
                            setRevision(r);
                            setHistories(h);
                        }
                    }
                    onActionCompleted={({ revisionId }) => history.replace("/pok/details/" + revisionId)}
                />
            </CCol>
        </CRow>
        <CRow>
            <CCol>
                <CCard>
                    <CCardHeader>
                        Detail POK
                        <div className="card-header-actions">
                            <CButton color="warning" onClick={doShowView}><CIcon size="sm" name="cil-magnifying-glass" /> View Document</CButton>
                        </div>
                    </CCardHeader>
                    <CCardBody>
                        <CFormGroup row>
                            <CCol md="3">
                                <CLabel>Pejabat</CLabel>
                            </CCol>
                            <CCol md="2" onChange={e => setOfficerCategory(e.target.value)}>
                                <CFormGroup variant="custom-radio" inline>
                                    <CInputRadio custom name="officer-category" id="inline-radio1" value="PUSAT" defaultChecked />
                                    <CLabel variant="custom-checkbox" htmlFor="inline-radio1">Pusat</CLabel>
                                </CFormGroup>
                                <CFormGroup variant="custom-radio" inline>
                                    <CInputRadio custom name="officer-category" id="inline-radio2" value="DAERAH" />
                                    <CLabel variant="custom-checkbox" htmlFor="inline-radio2">Daerah</CLabel>
                                </CFormGroup>
                            </CCol>
                            <CCol md="3">
                                <SelectOfficer category={officerCategory} onSelect={setOfficer} value={officer} selectFirst />
                            </CCol>
                        </CFormGroup>
                        <CFormGroup row>
                            <CCol md="3">
                                <CLabel>Tanggal Laporan</CLabel>
                            </CCol>
                            <CCol md="4">
                                <ReactDatePicker selected={reportDate} onChange={date => setReportDate(date)} customInput={<input type="text" className="form-control" value={e => reportDate.toLocaleDateString()} />} />
                            </CCol>
                        </CFormGroup>
                        <CFormGroup row>
                            <CCol md="3">
                                <CLabel>Status Data</CLabel>
                            </CCol>
                            <CCol md="2">
                                <SelectDataStatus revisionId={revision.id} onSelect={o => setFilter({ ...filter, first_status: o.value })} selectFirst />
                            </CCol>
                            <CCol md="2">
                                <CInputGroup>
                                    <CInputGroupPrepend>
                                        <CInputGroupText>Dan</CInputGroupText>
                                    </CInputGroupPrepend>
                                    <SelectDataStatus disabled={currentView === 'RENCANA_KERJA' || currentView === 'KOORDINAT_LOKASI'} revisionId={revision.id} onSelect={o => setFilter({ ...filter, second_status: o.value })} exclude={filter.first_status} />
                                </CInputGroup>
                            </CCol>
                        </CFormGroup>
                        <CFormGroup row onChange={onViewChange}>
                            <CCol md="3">
                                <CLabel>Dokumen POK</CLabel>
                            </CCol>
                            <CCol md="4">
                                <CFormGroup variant="custom-radio">
                                    <CInputRadio custom className="form-check-input" id="SURAT_PENGANTAR" name="view" value="SURAT_PENGANTAR" defaultChecked />
                                    <CLabel variant="custom-checkbox" htmlFor="SURAT_PENGANTAR">Surat Pengantar POK</CLabel>
                                </CFormGroup>
                            </CCol>
                            <CCol md="4">
                                <CFormGroup variant="custom-radio">
                                    <CInputRadio custom className="form-check-input" id="LAMPIRAN" name="view" value="LAMPIRAN" />
                                    <CLabel variant="custom-checkbox" htmlFor="LAMPIRAN">Lampiran</CLabel>
                                </CFormGroup>
                            </CCol>
                        </CFormGroup>

                        <CFormGroup row onChange={onViewChange}>
                            <CCol md="3">
                                <CLabel>Lampiran POK</CLabel>
                            </CCol>
                            <CCol md="4">
                                <CFormGroup variant="custom-radio">
                                    <CInputRadio custom className="form-check-input" id="CHECKLIST" name="view" value="CHECKLIST" />
                                    <CLabel variant="custom-checkbox" htmlFor="CHECKLIST">Lembar Kontrol</CLabel>
                                </CFormGroup>
                                <CFormGroup variant="custom-radio">
                                    <CInputRadio custom className="form-check-input" id="RENCANA_KERJA" name="view" value="RENCANA_KERJA" defaultChecked />
                                    <CLabel variant="custom-checkbox" htmlFor="RENCANA_KERJA">Rencana Kerja dan Anggaran</CLabel>
                                </CFormGroup>
                                <CFormGroup variant="custom-radio">
                                    <CInputRadio custom className="form-check-input" id="STRUKTUR_KEGIATAN" name="view" value="STRUKTUR_KEGIATAN" />
                                    <CLabel variant="custom-checkbox" htmlFor="STRUKTUR_KEGIATAN">Struktur Kegiatan</CLabel>
                                </CFormGroup>
                                <CFormGroup variant="custom-radio">
                                    <CInputRadio custom className="form-check-input" id="LINGKUP_KEGIATAN" name="view" value="LINGKUP_KEGIATAN" />
                                    <CLabel variant="custom-checkbox" htmlFor="LINGKUP_KEGIATAN">Lingkup Kegiatan</CLabel>
                                </CFormGroup>
                                <CFormGroup variant="custom-radio">
                                    <CInputRadio custom className="form-check-input" id="RINCIAN_KEGIATAN" name="view" value="RINCIAN_KEGIATAN" />
                                    <CLabel variant="custom-checkbox" htmlFor="RINCIAN_KEGIATAN">Rincian Kegiatan</CLabel>
                                </CFormGroup>
                            </CCol>
                            <CCol md="4">
                                <CFormGroup variant="custom-radio">
                                    <CInputRadio custom className="form-check-input" id="JADWAL_PELAKSANAAN" name="view" value="JADWAL_PELAKSANAAN" />
                                    <CLabel variant="custom-checkbox" htmlFor="JADWAL_PELAKSANAAN">Jadwal Pelaksanaan Kegiatan</CLabel>
                                </CFormGroup>
                                <CFormGroup variant="custom-radio">
                                    <CInputRadio custom className="form-check-input" id="KOORDINAT_LOKASI" name="view" value="KOORDINAT_LOKASI" />
                                    <CLabel variant="custom-checkbox" htmlFor="KOORDINAT_LOKASI">Koordinat Lokasi</CLabel>
                                </CFormGroup>
                                <CFormGroup variant="custom-radio">
                                    <CInputRadio custom className="form-check-input" id="STRUKTUR_SUMMARY" name="view" value="STRUKTUR_SUMMARY" />
                                    <CLabel variant="custom-checkbox" htmlFor="STRUKTUR_SUMMARY">Struktur Summary</CLabel>
                                </CFormGroup>
                                <CFormGroup variant="custom-radio">
                                    <CInputRadio custom className="form-check-input" id="PAKET_LONG_SEGMENT" name="view" value="PAKET_LONG_SEGMENT" />
                                    <CLabel variant="custom-checkbox" htmlFor="PAKET_LONG_SEGMENT">Daftar Paket Long Segmen</CLabel>
                                </CFormGroup>
                            </CCol>
                        </CFormGroup>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
        <CModal
            show={showView && currentView === "JADWAL_PELAKSANAAN"}
            onClose={() => setShowView(false)}
            className="dialog-fill"
            closeOnBackdrop={false}
        >
            <CModalHeader closeButton>
                <CModalTitle>Jadwal Pelaksanaan Kegiatan</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <PokHeader revision={revision} />
                <div className="ag-theme-balham" style={{ height: 550 }}>
                    <AgGridReact
                        defaultColDef={defaultColDef}
                        rowData={tableData}
                        rowClassRules={rowClassRules}
                    >
                        <AgGridColumn field="KODE_KEGIATAN" headerName="KODE PPK/GIAT/PAKET" cellRendererFramework={PreCell} width={200} ></AgGridColumn>
                        <AgGridColumn field="NAMA_KEGIATAN" headerName="NAMA PPK/KEGIATAN/PAKET/OUTPUT/KOMPONEN/MAK/ITEM KEGIATAN" cellRendererFramework={PreCell} width={500}></AgGridColumn>
                        <AgGridColumn field="STATUS" headerName="STATUS"></AgGridColumn>
                        <AgGridColumn headerName="SASARAN">
                            <AgGridColumn field="SASARAN_VOLUME" headerName="VOLUME" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                            <AgGridColumn field="SASARAN_SATUAN" headerName="SATUAN"></AgGridColumn>
                        </AgGridColumn>
                        <AgGridColumn field="ALOKASI_DANA" headerName="ALOKASI DANA (Rp. 1000)" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                        <AgGridColumn headerName="KUMULATIF RENCANA PENCAPAIAN">
                            <AgGridColumn field="JAN" headerName="JAN" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                            <AgGridColumn field="FEB" headerName="FEB" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                            <AgGridColumn field="MAR" headerName="MAR" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                            <AgGridColumn field="APR" headerName="APR" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                            <AgGridColumn field="MEI" headerName="MEI" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                            <AgGridColumn field="JUN" headerName="JUN" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                            <AgGridColumn field="JUL" headerName="JUL" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                            <AgGridColumn field="AGS" headerName="AGS" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                            <AgGridColumn field="SEP" headerName="SEP" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                            <AgGridColumn field="OKT" headerName="OKT" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                            <AgGridColumn field="NOV" headerName="NOV" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                            <AgGridColumn field="DES" headerName="DES" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                        </AgGridColumn>
                        <AgGridColumn field="KETERANGAN" headerName="KETERANGAN"></AgGridColumn>
                    </AgGridReact>
                </div>
                <p>
                    <br /><strong>Tanggal : </strong>{reportDate.toDateString()}
                    <br /><strong>Pejabat : </strong>{officer.label}
                </p>
            </CModalBody>
            <CModalFooter>
                <CButton color="primary" onClick={exportView}><CIcon size="sm" name="cil-arrow-thick-to-bottom" /> PDF</CButton>{' '}
                <CButton color="default" onClick={() => setShowView(null)}>Close</CButton>
            </CModalFooter>
        </CModal>
        <CModal
            show={showView && currentView === "RENCANA_KERJA"}
            onClose={() => setShowView(false)}
            className="dialog-fill"
            closeOnBackdrop={false}
        >
            <CModalHeader closeButton>
                <CModalTitle>Rencana Kerja dan Anggaran</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <PokHeader revision={revision} />
                <div className="ag-theme-balham" style={{ height: 550 }}>
                    <AgGridReact
                        className="grid-compact"
                        defaultColDef={defaultColDef}
                        rowData={tableData}
                        rowClassRules={rowClassRules}
                    >
                        <AgGridColumn field="KODE_KEGIATAN" headerName="KODE PPK/GIAT/PAKET" cellRendererFramework={PreCell} width={200} ></AgGridColumn>
                        <AgGridColumn field="NAMA_KEGIATAN" headerName="NAMA PPK/KEGIATAN/PAKET/OUTPUT/KOMPONEN/MAK/ITEM KEGIATAN" cellRendererFramework={PreCell} width={500}></AgGridColumn>
                        <AgGridColumn field="STATUS" headerName="STATUS"></AgGridColumn>
                        <AgGridColumn headerName="SASARAN">
                            <AgGridColumn field="SASARAN_VOLUME" headerName="Volume" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                            <AgGridColumn field="SASARAN_SATUAN" headerName="Satuan"></AgGridColumn>
                        </AgGridColumn>
                        <AgGridColumn headerName="Belanja Pegawai">
                            <AgGridColumn field="BELANJA_PEGAWAI_OPERASIONAL" headerName="Operasional" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                        </AgGridColumn>
                        <AgGridColumn headerName="Belanja Barang">
                            <AgGridColumn field="BELANJA_BARANG_OPERASIONAL" headerName="Operasional" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                            <AgGridColumn headerName="Non Operasional">
                                <AgGridColumn field="BLNJ_BRG_NON_OP_NON_PEND" headerName="Non Pendamping" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                                <AgGridColumn field="BLNJ_BRG_NON_OP_PEND" headerName="Pend." type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                                <AgGridColumn field="BLNJ_BRG_NON_OP_PHLN" headerName="PHLN - PLN" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                                <AgGridColumn field="BLNJ_BRG_NON_OP_SBSN" headerName="SBSN" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                            </AgGridColumn>
                        </AgGridColumn>
                        <AgGridColumn field="BELANJA_MODAL_OPERASIONAL" headerName="Operasional" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                        <AgGridColumn headerName="Belanja Modal Non Operasional">
                            <AgGridColumn field="BLNJ_MDL_NON_OP_NON_PEND" headerName="Non Pendamping" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                            <AgGridColumn field="BLNJ_MDL_NON_OP_PEND" headerName="Pend." type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                            <AgGridColumn field="BLNJ_MDL_NON_OP_PHLN" headerName="PHLN - PLN" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                            <AgGridColumn field="BLNJ_MDL_NON_OP_SBSN" headerName="SBSN" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                        </AgGridColumn>
                        <AgGridColumn field="JUMLAH_TOTAL" headerName="Jumlah Total" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                    </AgGridReact>
                </div>
                <p>
                    <br /><strong>Tanggal : </strong>{reportDate.toDateString()}
                    <br /><strong>Pejabat : </strong>{officer.label}
                </p>
            </CModalBody>
            <CModalFooter>
                <CButton color="primary" onClick={exportViewSpr}><CIcon size="sm" name="cil-arrow-thick-to-bottom" /> Excel</CButton>{' '}
                <CButton color="primary" onClick={exportView}><CIcon size="sm" name="cil-arrow-thick-to-bottom" /> PDF</CButton>{' '}
                <CButton color="default" onClick={() => setShowView(null)}>Close</CButton>
            </CModalFooter>
        </CModal>
        <CModal
            show={showView && currentView === "LINGKUP_KEGIATAN"}
            onClose={() => setShowView(false)}
            className="dialog-fill"
            closeOnBackdrop={false}
        >
            <CModalHeader closeButton>
                <CModalTitle>Lingkup Kegiatan</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <PokHeader revision={revision} />
                <div className="ag-theme-balham" style={{ height: 550 }}>
                    <AgGridReact
                        defaultColDef={defaultColDef}
                        rowData={tableData}
                        rowClassRules={rowClassRules}
                    >
                        <AgGridColumn field="KODE_KEGIATAN" headerName="KODE PPK/GIAT/PAKET" cellRendererFramework={PreCell} width={200} ></AgGridColumn>
                        <AgGridColumn field="NAMA_KEGIATAN" headerName="NAMA PPK/KEGIATAN/PAKET/OUTPUT/KOMPONEN/MAK/ITEM KEGIATAN" cellRendererFramework={PreCell} width={500}></AgGridColumn>
                        <AgGridColumn field="STATUS" headerName="STATUS"></AgGridColumn>
                        <AgGridColumn field="LOKASI_KEGIATAN" headerName="Lokasi Kegiatan"></AgGridColumn>
                        <AgGridColumn field="SUMBER_DANA" headerName="Sumber Dana"></AgGridColumn>
                        <AgGridColumn field="ALOKASI_DANA" headerName="Alokasi Dana (Rp.1000)" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                        <AgGridColumn headerName="SASARAN PENANGANAN">
                            <AgGridColumn headerName="SASARAN">
                                <AgGridColumn field="SASARAN_VOLUME" headerName="Volume" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                                <AgGridColumn field="SASARAN_SATUAN" headerName="Satuan"></AgGridColumn>
                            </AgGridColumn>
                            <AgGridColumn field="NOMOR_RUAS" headerName="Nomor Ruas"></AgGridColumn>
                            <AgGridColumn field="PANJANG_RUAS" headerName="Panjang Ruas (km)" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                            <AgGridColumn field="STS_JALAN" headerName="Sts. Jalan"></AgGridColumn>
                            <AgGridColumn field="INDIKASI_LOKASI_NAMA_JEMBATAN" headerName="Indikasi Lokasi (STA) / Nama Jembatan"></AgGridColumn>
                            <AgGridColumn headerName="KOORDINAT (FORMAT DECIMAL)">
                                <AgGridColumn field="KOORDINAT_X_AWAL" headerName="X Awal"></AgGridColumn>
                                <AgGridColumn field="KOORDINAT_Y_AWAL" headerName="Y Awal"></AgGridColumn>
                                <AgGridColumn field="KOORDINAT_X_AKHIR" headerName="X Akhir"></AgGridColumn>
                                <AgGridColumn field="KOORDINAT_Y_AKHIR" headerName="Y Akhir"></AgGridColumn>
                            </AgGridColumn>
                        </AgGridColumn>
                        <AgGridColumn headerName="PENANGANAN">
                            <AgGridColumn field="PANJANG_PENANGANAN" headerName="Panjang" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                            <AgGridColumn field="LEBAR_PENANGANAN" headerName="Lebar" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                            <AgGridColumn field="JENIS_PENANGANAN" headerName="Jenis"></AgGridColumn>
                        </AgGridColumn>
                        <AgGridColumn field="KET_REVISI" headerName="Ket. Revisi"></AgGridColumn>
                    </AgGridReact>
                </div>
                <p>
                    <br /><strong>Tanggal : </strong>{reportDate.toDateString()}
                    <br /><strong>Pejabat : </strong>{officer.label}
                </p>
            </CModalBody>
            <CModalFooter>
                <CButton color="primary" onClick={exportView}><CIcon size="sm" name="cil-arrow-thick-to-bottom" /> PDF</CButton>{' '}
                <CButton color="default" onClick={() => setShowView(null)}>Close</CButton>
            </CModalFooter>
        </CModal>
        <CModal
            show={showView && currentView === "STRUKTUR_KEGIATAN"}
            onClose={() => setShowView(false)}
            className="dialog-fill"
            closeOnBackdrop={false}
        >
            <CModalHeader closeButton>
                <CModalTitle>Struktur Kegiatan</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <PokHeader revision={revision} />
                <div className="ag-theme-balham" style={{ height: 550 }}>
                    <AgGridReact
                        defaultColDef={defaultColDef}
                        rowData={tableData}
                        rowClassRules={rowClassRules}
                    >
                        <AgGridColumn field="KODE_KEGIATAN" headerName="KODE PPK/GIAT/PAKET" cellRendererFramework={PreCell} width={200} ></AgGridColumn>
                        <AgGridColumn field="NAMA_KEGIATAN" headerName="NAMA PPK/KEGIATAN/PAKET/OUTPUT/KOMPONEN/MAK/ITEM KEGIATAN" cellRendererFramework={PreCell} width={500}></AgGridColumn>
                        <AgGridColumn field="STATUS" headerName="STATUS"></AgGridColumn>
                        <AgGridColumn field="JENIS_K_S" headerName="Jenis K/S"></AgGridColumn>
                        <AgGridColumn headerName="SASARAN">
                            <AgGridColumn field="SASARAN_VOLUME" headerName="Volume" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                            <AgGridColumn field="SASARAN_SATUAN" headerName="Satuan"></AgGridColumn>
                        </AgGridColumn>
                        <AgGridColumn headerName="Alokasi Dana">
                            <AgGridColumn field="BELANJA_PEGAWAI_OPERASIONAL" headerName="Belanja Pegawai Operasional" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                            <AgGridColumn headerName="Belanja Barang">
                                <AgGridColumn field="BELANJA_BARANG_OPERASIONAL" headerName="Operasional" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                                <AgGridColumn headerName="Non Operasional">
                                    <AgGridColumn field="BLNJ_BRG_NON_OP_NON_PEND" headerName="RM" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                                    <AgGridColumn field="BLNJ_BRG_NON_OP_PEND" headerName="Pend." type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                                    <AgGridColumn field="BLNJ_BRG_NON_OP_PHLN" headerName="PHLN" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                                    <AgGridColumn field="BLNJ_BRG_NON_OP_SBSN" headerName="SBSN" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                                </AgGridColumn>
                            </AgGridColumn>
                            <AgGridColumn field="BELANJA_MODAL_OPERASIONAL" headerName="Operasional" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                            <AgGridColumn headerName="Belanja Modal Non Operasional">
                                <AgGridColumn field="BLNJ_MDL_NON_OP_NON_PEND" headerName="RM" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                                <AgGridColumn field="BLNJ_MDL_NON_OP_PEND" headerName="Pend." type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                                <AgGridColumn field="BLNJ_MDL_NON_OP_PHLN" headerName="PHLN - PLN" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                                <AgGridColumn field="BLNJ_MDL_NON_OP_SBSN" headerName="SBSN" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                            </AgGridColumn>
                        </AgGridColumn>
                        <AgGridColumn field="JUMLAH_TOTAL" headerName="Jumlah Total" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                        <AgGridColumn field="SUMBER_DANA" headerName="Sumber Dana"></AgGridColumn>
                    </AgGridReact>
                </div>
                <p>
                    <br /><strong>Tanggal : </strong>{reportDate.toDateString()}
                    <br /><strong>Pejabat : </strong>{officer.label}
                </p>
            </CModalBody>
            <CModalFooter>
                <CButton color="primary" onClick={exportView}><CIcon size="sm" name="cil-arrow-thick-to-bottom" /> PDF</CButton>{' '}
                <CButton color="default" onClick={() => setShowView(null)}>Close</CButton>
            </CModalFooter>
        </CModal>
        <CModal
            show={showView && currentView === "STRUKTUR_SUMMARY"}
            onClose={() => setShowView(false)}
            className="dialog-fill"
            closeOnBackdrop={false}
        >
            <CModalHeader closeButton>
                <CModalTitle>Struktur Summary</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <PokHeader revision={revision} />
                <div className="ag-theme-balham" style={{ height: 550 }}>
                    <AgGridReact
                        defaultColDef={defaultColDef}
                        rowData={tableData}
                        rowClassRules={rowClassRules}
                    >
                        <AgGridColumn field="KODE_KEGIATAN" headerName="KODE PPK/GIAT/PAKET" cellRendererFramework={PreCell} width={200} ></AgGridColumn>
                        <AgGridColumn field="NAMA_KEGIATAN" headerName="NAMA PPK/KEGIATAN/PAKET/OUTPUT/KOMPONEN/MAK/ITEM KEGIATAN" cellRendererFramework={PreCell} width={500}></AgGridColumn>
                        <AgGridColumn field="STATUS" headerName="STATUS"></AgGridColumn>
                        <AgGridColumn field="JENIS_K_S" headerName="Jenis K/S"></AgGridColumn>
                        <AgGridColumn headerName="SASARAN VOLUME">
                            <AgGridColumn field="SASARAN_VOLUME" headerName="KM" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                            <AgGridColumn field="SASARAN_SATUAN" headerName="M"></AgGridColumn>
                        </AgGridColumn>
                        <AgGridColumn headerName="Alokasi Dana">
                            <AgGridColumn field="BELANJA_PEGAWAI_OPERASIONAL" headerName="Belanja Pegawai Operasional" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                            <AgGridColumn headerName="Belanja Barang">
                                <AgGridColumn field="BELANJA_BARANG_OPERASIONAL" headerName="Operasional" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                                <AgGridColumn headerName="Non Operasional">
                                    <AgGridColumn field="BLNJ_BRG_NON_OP_NON_PEND" headerName="RM" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                                    <AgGridColumn field="BLNJ_BRG_NON_OP_PEND" headerName="Pend." type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                                    <AgGridColumn field="BLNJ_BRG_NON_OP_PHLN" headerName="PHLN" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                                    <AgGridColumn field="BLNJ_BRG_NON_OP_SBSN" headerName="SBSN" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                                </AgGridColumn>
                            </AgGridColumn>
                            <AgGridColumn field="BELANJA_MODAL_OPERASIONAL" headerName="Operasional" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                            <AgGridColumn headerName="Belanja Modal Non Operasional">
                                <AgGridColumn field="BLNJ_MDL_NON_OP_NON_PEND" headerName="RM" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                                <AgGridColumn field="BLNJ_MDL_NON_OP_PEND" headerName="Pend." type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                                <AgGridColumn field="BLNJ_MDL_NON_OP_PHLN" headerName="PHLN - PLN" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                                <AgGridColumn field="BLNJ_MDL_NON_OP_SBSN" headerName="SBSN" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                            </AgGridColumn>
                        </AgGridColumn>
                        <AgGridColumn field="JUMLAH_TOTAL" headerName="Jumlah Total" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                        <AgGridColumn field="SUMBER_DANA" headerName="Sumber Dana"></AgGridColumn>
                    </AgGridReact>
                </div>
                <p>
                    <br /><strong>Tanggal : </strong>{reportDate.toDateString()}
                    <br /><strong>Pejabat : </strong>{officer.label}
                </p>
            </CModalBody>
            <CModalFooter>
                <CButton color="primary" onClick={exportView}><CIcon size="sm" name="cil-arrow-thick-to-bottom" /> PDF</CButton>{' '}
                <CButton color="default" onClick={() => setShowView(null)}>Close</CButton>
            </CModalFooter>
        </CModal>
        <CModal
            show={showView && currentView === "KOORDINAT_LOKASI"}
            onClose={() => setShowView(false)}
            className="dialog-fill"
            closeOnBackdrop={false}
        >
            <CModalHeader closeButton>
                <CModalTitle>Koordinat Lokasi</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <PokHeader revision={revision} />
                <div className="ag-theme-balham" style={{ height: 550 }}>
                    <AgGridReact
                        defaultColDef={defaultColDef}
                        rowData={tableData}
                        rowClassRules={rowClassRules}
                    >
                        <AgGridColumn field="NOPROP" headerName="Noprop" />
                        <AgGridColumn field="THANG" headerName="TA" />
                        <AgGridColumn field="STATUS_DATA" headerName="Status" />
                        <AgGridColumn field="KDSATKER" headerName="Kdsatker" />
                        <AgGridColumn field="KDDEPT" headerName="kddept" />
                        <AgGridColumn field="KDUNIT" headerName="Kdunit" />
                        <AgGridColumn field="KODE_PPK1" headerName="Kdppk1" />
                        <AgGridColumn field="NAMA_PPK" headerName="PPK" />
                        <AgGridColumn field="KDPROGRAM1" headerName="Kdprogram1" />
                        <AgGridColumn field="KODE_GIAT1" headerName="Kdgiat1" />
                        <AgGridColumn field="KODE_PAKET1" headerName="Kdpaket1" />
                        <AgGridColumn field="NAMA_PAKET" headerName="Paket" />
                        <AgGridColumn field="KDOUTPUT1" headerName="Kdoutput1" />
                        <AgGridColumn field="KDIB" headerName="Kdib" />
                        <AgGridColumn field="KDLOKASI" headerName="Kdlokasi" />
                        <AgGridColumn field="KDKABKOTA" headerName="Kdkabkota" />
                        <AgGridColumn field="KDSOUTPUT1" headerName="Kdsoutput1" />
                        <AgGridColumn field="KDKMPNEN1" headerName="Kdkmpnen1" />
                        <AgGridColumn field="NAMA_KOMPONEN" headerName="Komponen" />
                        <AgGridColumn field="KDSKMPNEN1" headerName="Kdskmpnen1" />
                        <AgGridColumn field="KDAKUN1" headerName="Kdakun1" />
                        <AgGridColumn field="KDKPPN" headerName="Kdkppn" />
                        <AgGridColumn field="REGISTER" headerName="Register" />
                        <AgGridColumn field="NOITEM" headerName="Noitem" />
                        <AgGridColumn field="KODE" headerName="Kode" />
                        <AgGridColumn field="DESK" headerName="Desk" />
                        <AgGridColumn field="SNF_VOL" headerName="Snf_vol" type="rightAligned" valueFormatter={thousandFormatter} />
                        <AgGridColumn field="SNF_SAT" headerName="Snf_sat" />
                        <AgGridColumn field="STS_RUAS" headerName="Sts_ruas" />
                        <AgGridColumn field="NORUAS" headerName="Noruas" />
                        <AgGridColumn field="INDIKASI" headerName="Indikasi" />
                        <AgGridColumn field="IND_AWAL" headerName="Ind_Awal" type="rightAligned" valueFormatter={thousandFormatter} />
                        <AgGridColumn field="IND_AKHIR" headerName="Ind_Akhir" type="rightAligned" valueFormatter={thousandFormatter} />
                        <AgGridColumn field="NO_JBTN" headerName="No_Jbtn" />
                        <AgGridColumn field="PANJANG" headerName="Panjang" type="rightAligned" valueFormatter={thousandFormatter} />
                        <AgGridColumn field="NAMA_LINKNAME" headerName="Nama / Linkname" />
                        <AgGridColumn field="X_AWAL" headerName="X_Awal" />
                        <AgGridColumn field="Y_AWAL" headerName="Y_Awal" />
                        <AgGridColumn field="X_AKHIR" headerName="X_Akhir" />
                        <AgGridColumn field="Y_AKHIR" headerName="Y_Akhir" />
                        <AgGridColumn field="PEG_OPR" headerName="peg_opr" type="rightAligned" valueFormatter={thousandFormatter} />
                        <AgGridColumn field="BRG_OPR" headerName="brg_opr" type="rightAligned" valueFormatter={thousandFormatter} />
                        <AgGridColumn field="BRG_NPDP" headerName="brg_npdp" type="rightAligned" valueFormatter={thousandFormatter} />
                        <AgGridColumn field="BRG_PDP" headerName="brg_pdp" type="rightAligned" valueFormatter={thousandFormatter} />
                        <AgGridColumn field="BRG_PLN" headerName="brg_pln" type="rightAligned" valueFormatter={thousandFormatter} />
                        <AgGridColumn field="BRG_SBSN" headerName="brg_sbsn" type="rightAligned" valueFormatter={thousandFormatter} />
                        <AgGridColumn field="MDL_OPR" headerName="mdl_opr" type="rightAligned" valueFormatter={thousandFormatter} />
                        <AgGridColumn field="MDL_NPDP" headerName="mdl_npdp" type="rightAligned" valueFormatter={thousandFormatter} />
                        <AgGridColumn field="MDL_PDP" headerName="mdl_pdp" type="rightAligned" valueFormatter={thousandFormatter} />
                        <AgGridColumn field="MDL_PLN" headerName="mdl_pln" type="rightAligned" valueFormatter={thousandFormatter} />
                        <AgGridColumn field="MDL_SBSN" headerName="mdl_sbsn" type="rightAligned" valueFormatter={thousandFormatter} />
                        <AgGridColumn field="TOTAL" headerName="total" type="rightAligned" valueFormatter={thousandFormatter} />
                        <AgGridColumn field="JENIS_PENANGANAN" headerName="penanganan" />
                    </AgGridReact>
                </div>
                <p>
                    <br /><strong>Tanggal : </strong>{reportDate.toDateString()}
                    <br /><strong>Pejabat : </strong>{officer.label}
                </p>
            </CModalBody>
            <CModalFooter>
                <CButton color="primary" onClick={exportViewSpr}><CIcon size="sm" name="cil-arrow-thick-to-bottom" /> Excel</CButton>{' '}
                <CButton color="primary" onClick={exportView}><CIcon size="sm" name="cil-arrow-thick-to-bottom" /> PDF</CButton>{' '}
                <CButton color="default" onClick={() => setShowView(null)}>Close</CButton>
            </CModalFooter>
        </CModal>
        <CModal
            show={showView && currentView === "PAKET_LONG_SEGMENT"}
            onClose={() => setShowView(false)}
            className="dialog-fill"
            closeOnBackdrop={false}
        >
            <CModalHeader closeButton>
                <CModalTitle>Daftar Paket Long Segment</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <PokHeader revision={revision} />
                <div className="ag-theme-balham" style={{ height: 550 }}>
                    <AgGridReact
                        defaultColDef={defaultColDef}
                        rowData={tableData}
                        rowClassRules={rowClassRules}
                    >
                        <AgGridColumn field="NAMA_LONG_SEGMEN" headerName="NAMA_LONG_SEGMEN" width={500} />
                        <AgGridColumn field="KODE_PAKET" headerName="KODE_PAKET" />
                        <AgGridColumn field="KODE_OUTPUT" headerName="KODE_OUTPUT" />
                        <AgGridColumn field="STATUS" headerName="STATUS" />
                        <AgGridColumn field="DESKRIPSI" headerName="DESKRIPSI" width={500} />
                        <AgGridColumn field="VOLUME" headerName="VOLUME" type="rightAligned" valueFormatter={thousandFormatter} />
                        <AgGridColumn field="SATUAN" headerName="SATUAN" />
                        <AgGridColumn field="ALOKASI" headerName="ALOKASI" type="rightAligned" valueFormatter={thousandFormatter} />
                    </AgGridReact>
                </div>
                <p>
                    <br /><strong>Tanggal : </strong>{reportDate.toDateString()}
                    <br /><strong>Pejabat : </strong>{officer.label}
                </p>
            </CModalBody>
            <CModalFooter>
                <CButton color="primary" onClick={exportViewSpr}><CIcon size="sm" name="cil-arrow-thick-to-bottom" /> Excel</CButton>{' '}
                <CButton color="primary" onClick={exportView}><CIcon size="sm" name="cil-arrow-thick-to-bottom" /> PDF</CButton>{' '}
                <CButton color="default" onClick={() => setShowView(null)}>Close</CButton>
            </CModalFooter>
        </CModal>
        <CModal
            show={showView && currentView === "RINCIAN_KEGIATAN"}
            onClose={() => setShowView(false)}
            className="dialog-fill"
            closeOnBackdrop={false}
        >
            <CModalHeader closeButton>
                <CModalTitle>Rincian Kegiatan</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <PokHeader revision={revision} />
                <CRow>
                    <CCol md="1">
                        <CLabel>Tampilkan : </CLabel>
                    </CCol>
                    <CCol md="10" onChange={e => setFilter({ ...filter, level: e.target.value })}>
                        <CFormGroup variant="custom-radio" inline>
                            <CInputRadio custom name="rincian_category" id="rc_satker" value="satker" defaultChecked />
                            <CLabel variant="custom-checkbox" htmlFor="rc_satker">Satker</CLabel>
                        </CFormGroup>
                        <CFormGroup variant="custom-radio" inline>
                            <CInputRadio custom name="rincian_category" id="rc_kro" value="kro" />
                            <CLabel variant="custom-checkbox" htmlFor="rc_kro">KRO</CLabel>
                        </CFormGroup>
                        <CFormGroup variant="custom-radio" inline>
                            <CInputRadio custom name="rincian_category" id="rc_ro" value="ro" />
                            <CLabel variant="custom-checkbox" htmlFor="rc_ro">RO</CLabel>
                        </CFormGroup>
                        <CFormGroup variant="custom-radio" inline>
                            <CInputRadio custom name="rincian_category" id="rc_komponen" value="komponen" />
                            <CLabel variant="custom-checkbox" htmlFor="rc_komponen">Komponen</CLabel>
                        </CFormGroup>
                        <CFormGroup variant="custom-radio" inline>
                            <CInputRadio custom name="rincian_category" id="rc_akun" value="akun" />
                            <CLabel variant="custom-checkbox" htmlFor="rc_akun">Akun</CLabel>
                        </CFormGroup>
                        <CFormGroup variant="custom-radio" inline>
                            <CInputRadio custom name="rincian_category" id="rc_item" value="item" />
                            <CLabel variant="custom-checkbox" htmlFor="rc_item">Item</CLabel>
                        </CFormGroup>
                    </CCol>
                </CRow>
                <div className="ag-theme-balham" style={{ height: 550 }}>
                    <AgGridReact
                        defaultColDef={defaultColDef}
                        rowData={tableData}
                        rowClassRules={rowClassRules}
                    >
                        <AgGridColumn field="KODE_KEGIATAN" headerName="KODE PPK/GIAT/PAKET" cellRendererFramework={PreCell} width={200} ></AgGridColumn>
                        <AgGridColumn field="NAMA_KEGIATAN" headerName="NAMA PPK/KEGIATAN/PAKET/OUTPUT/KOMPONEN/MAK/ITEM KEGIATAN" cellRendererFramework={PreCell} width={500}></AgGridColumn>
                        <AgGridColumn field="STATUS" headerName="STATUS"></AgGridColumn>
                        <AgGridColumn headerName="Perhitungan TA">
                            <AgGridColumn field="VOLUME_KEGIATAN" headerName="VOLUME KEGIATAN" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                            <AgGridColumn field="SATUAN" headerName="SATUAN"></AgGridColumn>
                            <AgGridColumn field="JUMLAH_BIAYA" headerName="JUMLAH BIAYA" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                        </AgGridColumn>
                        <AgGridColumn field="SUMBER_DANA" headerName="SUMBER DANA"></AgGridColumn>
                        <AgGridColumn field="CARA_BAYAR" headerName="KPPN/CARA BAYAR"></AgGridColumn>
                        <AgGridColumn field="JENIS_KONTRAK" headerName="JENIS KONTRAK"></AgGridColumn>
                        <AgGridColumn field="KET" headerName="KETERANGAN"></AgGridColumn>
                    </AgGridReact>
                </div>
                <p>
                    <br /><strong>Tanggal : </strong>{reportDate.toDateString()}
                    <br /><strong>Pejabat : </strong>{officer.label}
                </p>
            </CModalBody>
            <CModalFooter>
                <CButton color="primary" onClick={exportView}><CIcon size="sm" name="cil-arrow-thick-to-bottom" /> PDF</CButton>{' '}
                <CButton color="default" onClick={() => setShowView(null)}>Close</CButton>
            </CModalFooter>
        </CModal>
        <CModal
            show={showView && currentView === "CHECKLIST"}
            onClose={() => setShowView(false)}
            className="dialog-fill"
            closeOnBackdrop={false}
        >
            <CModalHeader closeButton>
                <CModalTitle>Lembar Kontrol</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <PokHeader revision={revision} />
                <CRow>
                    <CCol md="1">
                        <CLabel>Tampilkan : </CLabel>
                    </CCol>
                    <CCol md="10" onChange={e => setFilter({ ...filter, periode: e.target.value })}>
                        {
                            histories.map(h =>
                                <CFormGroup variant="custom-radio" inline key={h.id}>
                                    <CInputRadio custom name="checklist_periode" id={"periode_" + h.id} value={h.semester} defaultChecked={h.semester === "0"} />
                                    <CLabel variant="custom-checkbox" htmlFor={"periode_" + h.id}>Semester {h.semester}</CLabel>
                                </CFormGroup>
                            )
                        }
                    </CCol>
                </CRow>
                <div className="ag-theme-balham" style={{ height: 275 }}>
                    <AgGridReact
                        defaultColDef={defaultColDef}
                        rowData={tableData}
                        rowClassRules={rowClassRules}
                    >
                        <AgGridColumn field="NOMOR" headerName="No" cellRendererFramework={PreCell} width={100}></AgGridColumn>
                        <AgGridColumn field="NAMA_RINCIAN_OUTPUT" headerName="Nama Rincian Output" cellRendererFramework={PreCell} width={500}></AgGridColumn>

                        <AgGridColumn headerName={filter.periode === "0" ? "Data SAPSK" : "Data Awal"}>
                            <AgGridColumn headerName="Belanja Pegawai">
                                    <AgGridColumn field="AWAL_BLNJ_PEG_OP" headerName="Operasional" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                            </AgGridColumn>
                            <AgGridColumn headerName="Belanja Barang">
                                <AgGridColumn field="AWAL_BRG_RM" headerName="RM" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                                <AgGridColumn field="AWAL_BRG_NON_OPR" headerName="Non Opr" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                                <AgGridColumn field="AWAL_BRG_SBSN" headerName="SBSN" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                            </AgGridColumn>
                            <AgGridColumn headerName="Belanja Modal">
                                <AgGridColumn field="AWAL_MDL_RM" headerName="RM" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                                <AgGridColumn field="AWAL_MDL_NON_OPR" headerName="Non Opr" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                                <AgGridColumn field="AWAL_MDL_SBSN" headerName="SBSN" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                            </AgGridColumn>
                            <AgGridColumn field="AWAL_JUMLAH" headerName="Total" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                        </AgGridColumn>
                        {filter.periode !== "0" &&
                            <AgGridColumn headerName="Revisi 1">
                                <AgGridColumn headerName="Belanja Pegawai">
                                    <AgGridColumn field="REVISI_1_BLNJ_PEG_OP" headerName="Operasional" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                                </AgGridColumn>
                                <AgGridColumn headerName="Belanja Barang">
                                    <AgGridColumn field="REVISI_1_BRG_RM" headerName="RM" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                                    <AgGridColumn field="REVISI_1_BRG_NON_OPR" headerName="Non Opr" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                                    <AgGridColumn field="REVISI_1_BRG_SBSN" headerName="SBSN" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                                </AgGridColumn>
                                <AgGridColumn headerName="Belanja Modal">
                                    <AgGridColumn field="REVISI_1_MDL_RM" headerName="RM" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                                    <AgGridColumn field="REVISI_1_MDL_NON_OPR" headerName="Non Opr" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                                    <AgGridColumn field="REVISI_1_MDL_SBSN" headerName="SBSN" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                                </AgGridColumn>
                                <AgGridColumn field="REVISI_1_JUMLAH" headerName="Total" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                            </AgGridColumn>
                        }
                        {(filter.periode === "0" || filter.periode === "2") &&
                            <AgGridColumn headerName={filter.periode === "0" ? "Data Akhir" : "Revisi 2"}>
                                <AgGridColumn headerName="Belanja Pegawai">
                                    <AgGridColumn field="AKHIR_BLNJ_PEG_OP" headerName="Operasional" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                                </AgGridColumn>
                                <AgGridColumn headerName="Belanja Barang">
                                    <AgGridColumn field="AKHIR_BRG_RM" headerName="RM" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                                    <AgGridColumn field="AKHIR_BRG_NON_OPR" headerName="Non Opr" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                                    <AgGridColumn field="AKHIR_BRG_SBSN" headerName="SBSN" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                                </AgGridColumn>
                                <AgGridColumn headerName="Belanja Modal">
                                    <AgGridColumn field="AKHIR_MDL_RM" headerName="RM" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                                    <AgGridColumn field="AKHIR_MDL_NON_OPR" headerName="Non Opr" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                                    <AgGridColumn field="AKHIR_MDL_SBSN" headerName="SBSN" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                                </AgGridColumn>
                                <AgGridColumn field="AKHIR_JUMLAH" headerName="Total" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                            </AgGridColumn>
                        }
                        <AgGridColumn field="KETERANGAN" headerName="Keterangan"></AgGridColumn>
                    </AgGridReact>
                </div>
                <div className="ag-theme-balham mt-2" style={{ height: 275 }}>
                    <AgGridReact
                        defaultColDef={defaultColDef}
                        rowData={tableData2}
                        rowClassRules={rowClassRules}
                    >
                        <AgGridColumn field="NOMOR" headerName="No" width={100}></AgGridColumn>
                        <AgGridColumn field="NAMA_RINCIAN_OUTPUT" headerName="Total Penanganan (Rincian Output)" cellRendererFramework={PreCell} width={500}></AgGridColumn>
                        <AgGridColumn headerName={filter.periode === "0" ? "Data SAPSK" : "Data Awal"}>
                            <AgGridColumn field="SATUAN" headerName="Satuan"></AgGridColumn>
                            <AgGridColumn field="AWAL_VOL" headerName="Volume" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                            <AgGridColumn field="AWAL_RPM" headerName="RPM" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                            <AgGridColumn field="AWAL_PHLN" headerName="PHLN" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                            <AgGridColumn field="AWAL_BLOKIR" headerName="Blokir" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                            <AgGridColumn field="AWAL_SBSN" headerName="SBSN" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                            <AgGridColumn field="AWAL_JUMLAH" headerName="Total" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                        </AgGridColumn>
                        {filter.periode !== "0" &&
                            <AgGridColumn headerName="Revisi 1">
                                <AgGridColumn field="REVISI_1_VOL" headerName="Volume" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                                <AgGridColumn field="REVISI_1_RPM" headerName="RPM" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                                <AgGridColumn field="REVISI_1_PHLN" headerName="PHLN" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                                <AgGridColumn field="REVISI_1_BLOKIR" headerName="Blokir" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                                <AgGridColumn field="REVISI_1_SBSN" headerName="SBSN" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                                <AgGridColumn field="REVISI_1_JUMLAH" headerName="Total" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                            </AgGridColumn>
                        }
                        {(filter.periode === "0" || filter.periode === "2") &&
                            <AgGridColumn headerName={filter.periode === "0" ? "Data Akhir" : "Revisi 2"}>
                                <AgGridColumn field="AKHIR_VOL" headerName="Volume" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                                <AgGridColumn field="AKHIR_RPM" headerName="RPM" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                                <AgGridColumn field="AKHIR_PHLN" headerName="PHLN" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                                <AgGridColumn field="AKHIR_BLOKIR" headerName="Blokir" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                                <AgGridColumn field="AKHIR_SBSN" headerName="SBSN" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                                <AgGridColumn field="AKHIR_JUMLAH" headerName="Total" type="rightAligned" valueFormatter={thousandFormatter}></AgGridColumn>
                            </AgGridColumn>
                        }
                        <AgGridColumn field="KETERANGAN" headerName="KETERANGAN"></AgGridColumn>
                    </AgGridReact>
                </div>
                <p>
                    <br /><strong>Tanggal : </strong>{reportDate.toDateString()}
                    <br /><strong>Pejabat : </strong>{officer.label}
                </p>
            </CModalBody>
            <CModalFooter>
                <CButton color="primary" onClick={exportViewSpr}><CIcon size="sm" name="cil-arrow-thick-to-bottom" /> Excel</CButton>{' '}
                <CButton color="primary" onClick={exportView}><CIcon size="sm" name="cil-arrow-thick-to-bottom" /> PDF</CButton>{' '}
                <CButton color="default" onClick={() => setShowView(null)}>Close</CButton>
            </CModalFooter>
        </CModal>
        <CModal
            show={showView && currentView === "LAMPIRAN"}
            onClose={() => setShowView(false)}
            className="dialog-fill"
            closeOnBackdrop={false}
        >
            <CModalHeader closeButton>
                <CModalTitle>Lampiran</CModalTitle>
            </CModalHeader>
            <CModalBody>
                {
                    currentView === "LAMPIRAN" &&
                    <PdfViewer url={`api/pok/document?id=${match.params.id}&view=${currentView}&officerId=${officer.value}&t=${session.access}&embed`} />
                }
            </CModalBody>
            <CModalFooter>
                <CButton color="primary" onClick={exportView}><CIcon size="sm" name="cil-arrow-thick-to-bottom" /> PDF</CButton>{' '}
                <CButton color="default" onClick={() => setShowView(null)}>Close</CButton>
            </CModalFooter>
        </CModal>
        <CModal
            show={showView && currentView === "SURAT_PENGANTAR"}
            onClose={() => setShowView(false)}
            size="xl"
            closeOnBackdrop={false}
        >
            <CModalHeader closeButton>
                <CModalTitle>Surat Pengantar</CModalTitle>
            </CModalHeader>
            <CModalBody className="text-center">
                {
                    currentView === "SURAT_PENGANTAR" &&
                    <PdfViewer url={`api/pok/document?id=${match.params.id}&view=${currentView}&officerId=${officer.value}&t=${session.access}&embed`} />
                }
            </CModalBody>
            <CModalFooter>
                <CButton color="primary" onClick={exportView}><CIcon size="sm" name="cil-arrow-thick-to-bottom" /> PDF</CButton>{' '}
                <CButton color="default" onClick={() => setShowView(null)}>Close</CButton>
            </CModalFooter>
        </CModal>
    </>
};

export default PokDetails;