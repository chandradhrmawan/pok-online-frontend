import { CButton, CCard, CCardBody, CCardHeader, CDataTable, CFormGroup, CInput, CLabel, CModal, CModalBody, CModalFooter, CModalHeader } from '@coreui/react';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import SelectPermission from 'src/reusable/SelectPermission';
import SelectRole from 'src/reusable/SelectRole';
import SecurityContext from 'src/SecurityContext';

const UserManagement = () => {

    const { get, post } = useContext(SecurityContext);
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [filter, setFilter] = useState();
    const [showConfirmActivation, setShowConfirmActivation] = useState(false);
    const [showConfirmSuspend, setShowConfirmSuspend] = useState(false);
    const [showUserDetail, setShowUserDetail] = useState(false);
    const [currentUser, setCurrentUser] = useState({ loginName: null, givenName: null, familyName: null, emailAddress: null, cellNo: null,});
    const [permission, setPermission] = useState(null);
    const [role, setRole] = useState(null); 

    const loadUser = useCallback( () => get("/api/user/list").then(r => setUsers(r.data)), [get]);

    useEffect(() => loadUser(), [get, loadUser]);

    useEffect(() => {
        if (filter) {
            setFilteredUsers(users.filter(u => u.name.toLowerCase().indexOf(filter.toLowerCase()) > -1 ));
        } else {
            setFilteredUsers(users);
        }
    }, [users, filter])

    const handleEdit = (item) => {
        if (item.roles) {
            const r = item.roles[0];
            setRole({label: r.kdsatker + " - " + r.name, value: r.id});
        }
        if (item.permissions) {
            const r = item.permissions[0];
            setPermission({label: r.name, value: r.id});
        }
        setCurrentUser({ ...item });
        setShowUserDetail(true);
    }

    const handleActivate = () => {
        post("/api/user/activate?id=" + currentUser.id)
            .then(r => {
                setShowConfirmActivation(false);
                loadUser();
            });
    }
    const handleSuspend = () => {
        post("/api/user/suspend?id=" + currentUser.id)
            .then(r => {
                setShowConfirmSuspend(false);
                loadUser();
            });
    }
    
    const handleSave = () => {
        const data = new FormData();
        data.append("userId", currentUser.id);
        data.append("email", currentUser.email);
        data.append("familyName", "");
        data.append("givenName", currentUser.name);
        data.append("phone", currentUser.phone);
        data.append("permissionId", permission.value);
        data.append("roleId", role.value);
        post('/api/user/update-user', data).then(r => loadUser());
        setShowUserDetail(false);
    }

    return <>
        <CCard>
            <CCardHeader>
                User Management
            </CCardHeader>
            <CCardBody>
                <CInput placeholder="search" onChange={e => setFilter(e.target.value)}></CInput>
                <br />
                <br />
                <CDataTable items={filteredUsers} fields={[
                    "name",
                    "username",
                    "email",
                    "phone",
                    "externalUser",
                    "active",
                    "action",
                ]}
                    scopedSlots={
                        {
                            "action": (item, index) => {
                                return (
                                    <td className="py-2">
                                        <CButton
                                            color={item.active ? 'danger' : 'primary'}
                                            variant="outline"
                                            shape="square"
                                            size="sm"
                                            onClick={() => {
                                                setCurrentUser(item);
                                                if (item.active) {
                                                    setShowConfirmSuspend(true)
                                                } else {
                                                    setShowConfirmActivation(true);
                                                }
                                            }}
                                        >
                                            {item.active ? 'Suspend' : 'Activate'}
                                        </CButton>
                                        <CButton
                                            color="success"
                                            variant="outline"
                                            shape="square"
                                            size="sm"
                                            onClick={() => handleEdit(item)}
                                        >
                                            Edit
                                        </CButton>
                                    </td>
                                )
                            }
                        }
                    } />
            </CCardBody>
        </CCard>
        <CModal show={showConfirmActivation} onClose={() => setShowConfirmActivation(false)}>
            <CModalHeader>User Activation</CModalHeader>
            <CModalBody>Activate this user ?</CModalBody>
            <CModalFooter>
                <CButton color="primary" onClick={handleActivate}>Activate</CButton>
                <CButton onClick={() => setShowConfirmActivation(false)}>Cancel</CButton>
            </CModalFooter>
        </CModal>

        <CModal show={showConfirmSuspend} onClose={() => setShowConfirmSuspend(false)}>
            <CModalHeader>User Suspend</CModalHeader>
            <CModalBody>Suspend this user ?</CModalBody>
            <CModalFooter>
                <CButton color="danger" onClick={handleSuspend}>Suspend</CButton>
                <CButton onClick={() => setShowConfirmSuspend(false)}>Cancel</CButton>
            </CModalFooter>
        </CModal>

        <CModal show={showUserDetail} onClose={() => setShowUserDetail(false)}>
            <CModalHeader>User Details</CModalHeader>
            <CModalBody>
                <CFormGroup>
                    <CLabel>Username</CLabel>
                    <CInput type="text" value={currentUser.username} readOnly />
                </CFormGroup>
                <CFormGroup>
                    <CLabel>Name</CLabel>
                    <CInput type="text" value={currentUser.name} />
                </CFormGroup>
                <CFormGroup>
                    <CLabel>Email</CLabel>
                    <CInput type="text" value={currentUser.email} />
                </CFormGroup>
                <CFormGroup>
                    <CLabel>Phone</CLabel>
                    <CInput type="text" value={currentUser.phone} />
                </CFormGroup>
                <CFormGroup>
                    <CLabel>Role</CLabel>
                    <SelectRole value={role} onSelect={setRole}/>
                </CFormGroup>
                <CFormGroup>
                    <CLabel>Permission</CLabel>
                    <SelectPermission value={permission} onSelect={setPermission} />
                </CFormGroup>
            </CModalBody>
            <CModalFooter>
                <CButton color="primary" onClick={handleSave}>Save</CButton>
                <CButton onClick={() => setShowUserDetail(false)}>Cancel</CButton>
            </CModalFooter>
        </CModal>
    </>

};

export default UserManagement;
