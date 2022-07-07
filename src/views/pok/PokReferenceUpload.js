import CIcon from "@coreui/icons-react";
import { CAlert, CButton, CCard, CCardBody, CCardHeader, CCol, CDataTable, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CRow } from "@coreui/react";
import JSZip from "jszip";
import React, { useContext, useState } from "react";
import SecurityContext from "src/SecurityContext";

const PokReferenceUpload = () => {
    const {post} = useContext(SecurityContext);
    const [zipContent, setZipContent] = useState([]);
    const [confirm, setConfirm] = useState(false);
    const [zip, setZip] = useState(null);
    const [alertSuccess, setSuccessAlert] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

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
        const data = new FormData();
        data.append("dbfile", zip);
        
        post("/api/references/upload", data)
        .then(r => {
            setConfirm(false);
            if (r.status === 200) {
                setError(false);
                setSuccessAlert(true);
            } else {
                setError(true);
                setSuccessAlert(false);
                setErrorMessage("Failed to insert references");
            }
        });
    }

    return <>
        <CRow>
            <CCol>
                <CCard>
                    <CCardHeader>
                        Update References
                        <div className="card-header-actions">
                            <label className="btn btn-warning btn-md mr-2 mt-2">
                                <input type="file" style={{display: "none"}} accept=".zip" onChange={fileSelected}></input>
                                <CIcon name="cil-folder" size="sm" /> Browse
                            </label>
                            <CButton disabled={!zip} color="primary" size="md" onClick={() => setConfirm(true)}>Update</CButton>
                        </div>
                    </CCardHeader>
                    <CCardBody>
                        <CAlert color="success" show={alertSuccess}>References updated successfully</CAlert>
                        <CAlert color="danger" show={error}>{errorMessage}</CAlert>
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
        <CModal show={confirm} size="md" color="warning" onClose={() => setConfirm(false)}>
            <CModalHeader>
                <CModalTitle>Update Data Referensi</CModalTitle>
            </CModalHeader>
            <CModalBody>
                Upload database file untuk update data referensi?
            </CModalBody>
            <CModalFooter>
                <CButton onClick={create} color="warning">Update</CButton>
                <CButton onClick={() => setConfirm(false)}>Close</CButton>
            </CModalFooter>
        </CModal>
    </>

}

export default PokReferenceUpload;