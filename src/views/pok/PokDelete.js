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
import { SelectSatker, SelectBudgetYear } from "src/reusable";
import SecurityContext from "src/SecurityContext";
import { InputSelect } from "src/components"

const PokDelete = () => {
    const history = useHistory();
    const { post } = useContext(SecurityContext);
    const [info, setInfo] = useState({});
    const [error, setError] = useState();
    const [confirm, setConfirm] = useState(false);
    const [bussy, setBussy] = useState(false);
    const [alertSuccess, setSuccessAlert] = useState(false);
    const [status, setStatus] = useState([
        {
            label: 'SEMUA',
            value: '-'
        },
        {
            label: 'AWAL - 0',
            value: '0'
        },
        {
            label: '1',
            value: '1'
        },
        {
            label: '2',
            value: '2'
        }
    ])
    const [selectedStatus, setSelectedStatus] = useState({});

    const doDelete = () => {
        setError(null);
        setBussy(true);
        const data = new FormData();
        data.append("kdsatker", info.satker.value);
        data.append("status", selectedStatus.value);
        data.append("thang",info.budgetYear.value);

        post("/api/pok/delete", data).then(r => {
            setConfirm(false);
            setSuccessAlert(true);
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
                        Delete Data POK
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
                            </CFormGroup>

                            <CFormGroup row>
                                <CCol md="1">
                                    <CLabel>Tahun</CLabel>
                                </CCol>
                                <CCol xs="10" md="5">
                                    <SelectBudgetYear
                                        onSelect={o => setInfo({ ...info, budgetYear: o })}
                                        value={info.budgetYear}
                                        selectFirst
                                    />
                                </CCol>
                            </CFormGroup>

                            <CFormGroup row>
                                <CCol xs="10" md="5">
                                    <CButton color="danger" size="md" onClick={() => { setConfirm(true); setError(null); }}>Delete</CButton>
                                </CCol>
                            </CFormGroup>

                        </CForm>

                        <CCardBody>
                            <CAlert color="success" show={alertSuccess}>Delete POK successfully</CAlert>
                        </CCardBody>
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