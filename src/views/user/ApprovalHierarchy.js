import { CButton, CCard, CCardBody, CCardHeader, CDataTable, CFormGroup, CLabel, CModal, CModalBody, CModalFooter, CModalHeader } from '@coreui/react';
import React, { useContext, useEffect, useState } from 'react';
import SelectUserRole from 'src/reusable/SelectUserRole';
import SecurityContext from 'src/SecurityContext';

const ApprovalHierarchy = () => {

    const { get, post } = useContext(SecurityContext);
    const [hierarchy, setHierarchy] = useState([]);
    const [showDialog, setShowDialog] = useState(false);
    const [from, setFrom] = useState(null);
    const [to, setTo] = useState(null);

    useEffect(() => get("/api/references/approval-hierarchy").then(r => setHierarchy(r.data)), [get]);

    const handleAdd = () => {
        setFrom(null);
        setTo(null);
        setShowDialog(true);
    }
    const handleEdit = (item) => {
        setFrom({ value: item.fromUserId, label: item.fromUser });
        setTo({ value: item.toUserId, label: item.toUser });
        setShowDialog(true);
    }

    const handleSave = () => {
        console.log(from, to);
        const data = new FormData();
        data.append("fromUserId", from.value);
        data.append("toUserId", to.value);
        post("/api/references/approval-hierarchy", data)
        .then(response => setShowDialog(false));
    }

    return <>
        <CCard>
            <CCardHeader>
                Approval Hierarchy
                <div className="card-header-actions">
                    <CButton color="primary" onClick={handleAdd}>Add Hierarchy</CButton>
                </div>
            </CCardHeader>
            <CCardBody>
                <CDataTable
                    items={hierarchy}
                    fields={["fromUser", "fromRole", "toUser", "toRole", "action"]}
                    scopedSlots={{
                        "action": item => <td><CButton variant="outline" color="success" size="sm" onClick={() => handleEdit(item)}>Edit</CButton></td>
                    }} />
            </CCardBody>
        </CCard>
        <CModal show={showDialog} onClose={() => setShowDialog(false)} size="lg">
            <CModalHeader>Hierarchy</CModalHeader>
            <CModalBody>
                <CFormGroup>
                    <CLabel>From User</CLabel>
                    <SelectUserRole type="ESELON" value={from} onSelect={i => setFrom(i)} />
                </CFormGroup>
                <CFormGroup>
                    <CLabel>To User</CLabel>
                    <SelectUserRole type="ESELON" value={to} onSelect={i => setTo(i)} />
                </CFormGroup>
            </CModalBody>
            <CModalFooter>
                <CButton color="primary" onClick={handleSave}>Save</CButton>
                <CButton color="danger" onClick={() => setShowDialog(false)}>Close</CButton>
            </CModalFooter>
        </CModal>
    </>

};

export default ApprovalHierarchy;
