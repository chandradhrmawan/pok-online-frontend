import CIcon from '@coreui/icons-react';
import {
    CButton, CCard, CCardBody, CCardHeader, CCol,
    CCollapse, CForm,
    CFormGroup,
    CLabel
} from '@coreui/react';
import React, { useEffect, useState } from 'react';
import { SelectBudgetYear, SelectLocation, SelectRevisionStatus, SelectSatker, SelectSemester } from 'src/reusable';

const initFilter = {
    lokasi: null,
    satker: null,
    thang: null,
    status: null,
    revisionSeqNo: null,
    koordinatStatus: null,
    revstat: null,
};

const PokFilter = ({onFilterChanged}) => {
    const [showFilter, setShowFilter] = useState(false);
    const [filter, setFilter] =  useState({...initFilter});

    const clearFilter = () => setFilter({...initFilter});

    useEffect(() => onFilterChanged({...filter}), [onFilterChanged, filter]);

    return <>
        <CCard borderColor="">
            <CCardHeader>
                Filters
                <div className="card-header-actions">
                    <CButton size="sm" color="danger" variant="ghost"><CIcon name="cil-filter-x" className="float-right" onClick={clearFilter} /></CButton>
                    <CButton size="sm" variant="ghost"><CIcon name={showFilter ? "cil-caret-top" : "cil-caret-bottom"} className="float-right" onClick={() => setShowFilter(!showFilter)} /></CButton>
                </div>
            </CCardHeader>
            <CCollapse show={showFilter}>
                <CCardBody>
                    <CForm action="" method="post" className="form-horizontal">
                        <CFormGroup row>
                            <CCol md="1">
                                <CLabel>Provinsi</CLabel>
                            </CCol>
                            <CCol xs="11" md="5">
                                <SelectLocation clearable onSelect={o => setFilter({...filter, lokasi: o})} value={filter.lokasi} />
                            </CCol>
                            <CCol md="1">
                                <CLabel>Satker</CLabel>
                            </CCol>
                            <CCol xs="11" md="5">
                                <SelectSatker clearable onSelect={o => setFilter({...filter, satker: o})} value={filter.satker} />
                            </CCol>
                        </CFormGroup>
                        <CFormGroup row>
                            <CCol md="1">
                                <CLabel>TA</CLabel>
                            </CCol>
                            <CCol xs="11" md="3">
                                <SelectBudgetYear clearable onSelect={o => setFilter({...filter, thang: o})} value={filter.thang} />
                            </CCol>
                            <CCol md="1">
                                <CLabel>Status Data/ Semester</CLabel>
                            </CCol>
                            <CCol xs="11" md="3">
                                <SelectSemester clearable onSelect={o => setFilter({...filter, revisionSeqNo: o})} value={filter.revisionSeqNo} />
                            </CCol>
                            <CCol md="1">
                                <CLabel>Status POK</CLabel>
                            </CCol>
                            <CCol xs="11" md="3">
                                <SelectRevisionStatus clearable onSelect={o => setFilter({...filter, revstat: o})} value={filter.revstat} />
                            </CCol>
                        </CFormGroup>
                    </CForm>
                </CCardBody>
            </CCollapse>
        </CCard>
    </>;
};

export default PokFilter;