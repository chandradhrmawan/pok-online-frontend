import CIcon from "@coreui/icons-react";
import { CAlert, CButton, CCard, CCardBody, CCardHeader, CCol, CDataTable, CForm, CFormGroup, CLabel, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CRow } from "@coreui/react";
import JSZip from "jszip";
import React, { useContext, useState } from "react";
import { useHistory } from "react-router";
import { SelectBudgetYear, SelectLocation, SelectSatker } from "src/reusable";
import SecurityContext from "src/SecurityContext";

const PokUpload = () => {
    const history = useHistory();
    const {post} = useContext(SecurityContext);
    const [info, setInfo] = useState({});
    const [error, setError] = useState();
    const [zipContent, setZipContent] = useState([]);
    const [confirm, setConfirm] = useState(false);
    const [zip, setZip] = useState(null);
    const [bussy, setBussy] = useState(false);

    const fileSelected = (e) => {
        if (e.target.files) {
            setZip(e.target.files[0]);
            JSZip.loadAsync(e.target.files[0])
                .then(zip => {
                    const content = [];
                    zip.forEach((relativePath, zipEntry) => {
                        content.push({
                            fileName: zipEntry.name,
                            modificationDate: zipEntry.date.toLocaleString(),
                            path: relativePath
                        })
                    });
                    setZipContent(content);
                })
        }
    }

    const create = () => {
        setError(null);
        setBussy(true);
        const data = new FormData();
        data.append("kdsatker", info.satker.value);
        data.append("kdlokasi", info.lokasi.value);
        data.append("thang", info.budgetYear.value);
        data.append("periode", 0);
        data.append("mode", "NEW");
        data.append("dbfile", zip);
        
        post("/api/pok/create", data).then(r => {
            setConfirm(false);
            history.push("/pok/details/" + r.data.revisionId);
        }).catch(e => {
            setError(e.response.data.message);
        }).finally(() => setBussy(false));
    }

    return <>
        <CRow>
            <CCol>
                <CCard>
                    <CCardHeader>
                        Upload Database POK
                        <div className="card-header-actions">
                            <CButton color="primary" size="md" disabled={!zip} onClick={() => { setConfirm(true); setError(null); }}>Save</CButton>
                        </div>
                    </CCardHeader>
                    <CCardBody>
                        <CForm className="form-horizontal">
                            <CFormGroup row>
                                <CCol md="1">
                                    <CLabel>Provinsi</CLabel>
                                </CCol>
                                <CCol xs="11" md="5">
                                    <SelectLocation onSelect={o => setInfo({ ...info, lokasi: o })} value={info.lokasi} selectFirst />
                                </CCol>
                                <CCol md="1">
                                    <CLabel>Satker</CLabel>
                                </CCol>
                                <CCol xs="11" md="5">
                                    <SelectSatker onSelect={o => setInfo({ ...info, satker: o })} value={info.satker} selectFirst />
                                </CCol>
                            </CFormGroup>
                            <CFormGroup row>
                                <CCol md="1">
                                    <CLabel>Tahun Anggaran</CLabel>
                                </CCol>
                                <CCol xs="11" md="3">
                                    <SelectBudgetYear onSelect={o => setInfo({ ...info, budgetYear: o })} value={info.budgetYear} selectFirst />
                                </CCol>
                                <CCol md="2" />
                                <CCol md="1">
                                    <CLabel>Pilih File (.zip)</CLabel>
                                </CCol>
                                <CCol xs="11" md="3">
                                    <label className="btn btn-warning">
                                        <input type="file" style={{display: "none"}} accept=".zip" onChange={fileSelected}></input>
                                        <CIcon name="cil-folder" size="sm" /> Browse
                                    </label>
                                </CCol>
                            </CFormGroup>
                        </CForm>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
        <CRow>
            <CCol>
                <CCard>
                    <CCardHeader>
                        Database Info
                    </CCardHeader>
                    <CCardBody>
                        <CDataTable                        
                            size="sm"
                            items={zipContent}
                            hover
                            striped
                        />
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
        <CModal show={confirm} size="lg" color="warning" onClose={() => setConfirm(false)}>
            <CModalHeader>
                <CModalTitle>Create POK</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <p>Upload database file untuk pembuatan POK?</p>
                {
                    error && <CAlert color="danger">{error}</CAlert>
                }
            </CModalBody>
            <CModalFooter>
                <CButton onClick={create} disabled={bussy} color="warning">Create</CButton>
                <CButton onClick={() => setConfirm(false)}>Close</CButton>
            </CModalFooter>
        </CModal>
    </>

}

export default PokUpload;