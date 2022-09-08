import {
    CAlert,
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CForm,
    CFormGroup,
    CLabel,
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CModalTitle,
    CRow
} from "@coreui/react";
import React, { useContext, useState } from "react";
import { useHistory } from "react-router";
import { SelectSatker } from "src/reusable";
import SecurityContext from "src/SecurityContext";
import { InputSelect } from "src/components"

const PokDelete = () => {
    const history = useHistory();
    const { post } = useContext(SecurityContext);
    const [info, setInfo] = useState({});
    const [error, setError] = useState();
    const [confirm, setConfirm] = useState(false);
    const [bussy, setBussy] = useState(false);
    const [status, setStatus] = useState([
        {
            label: 'SEMUA',
            value: '-'
        },
        {
            label: 'AWAL - 0',
            value: '0'
        }
    ])
    const [selectedStatus, setSelectedStatus] = useState({});

    const doDelete = () => {
        setError(null);
        setBussy(true);
        const data = new FormData();
        data.append("kdsatker", info.satker.value);
        data.append("status", selectedStatus.value);

        post("/api/pok/delete", data).then(r => {
            setConfirm(false);
        }).catch(e => {
            setError(e.response.data.message);
        }).finally(() => setBussy(false));
    }

    const handleSelectSatker = (e) => {
        setInfo({ ...info, satker: e })
    }

    const handleSelectStatus = (e) => {
        setSelectedStatus(e)
    }


    return <>
        <CRow>
            <CCol>
                <CCard>
                    <CCardHeader>
                        Delete Data Awal POK
                    </CCardHeader>
                    <CCardBody>
                        <CForm className="form-horizontal">
                            <CFormGroup row>
                                <CCol md="1">
                                    <CLabel>Satker</CLabel>
                                </CCol>
                                <CCol xs="10" md="5">
                                    <SelectSatker onSelect={(e) => handleSelectSatker(e)} value={info.satker} selectFirst />
                                </CCol>
                            </CFormGroup>

                            <CFormGroup row>
                                <CCol md="1">
                                    <CLabel>Status</CLabel>
                                </CCol>
                                <CCol xs="10" md="5">
                                    <InputSelect
                                        options={status}
                                        onSelect={(e) => handleSelectStatus(e)}
                                        value={selectedStatus}
                                        selectFirst
                                    />
                                </CCol>
                                <CCol xs="10" md="5">
                                    <CButton color="danger" size="md" onClick={() => { setConfirm(true); setError(null); }}>Delete</CButton>
                                </CCol>
                            </CFormGroup>

                        </CForm>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>

        <CModal show={confirm} size="lg" color="warning" onClose={() => setConfirm(false)}>
            <CModalHeader>
                <CModalTitle>Hapus POK</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <p>Konfirmasi Hapus Data POK?</p>
                {
                    error && <CAlert color="danger">{error}</CAlert>
                }
            </CModalBody>
            <CModalFooter>
                <CButton onClick={doDelete} disabled={bussy} color="warning">Hapus</CButton>
                <CButton onClick={() => setConfirm(false)}>Close</CButton>
            </CModalFooter>
        </CModal>
    </>

}

export default PokDelete;