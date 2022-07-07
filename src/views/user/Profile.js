import { CBadge, CButton, CCard, CCardBody, CCardFooter, CCardHeader, CFormGroup, CInput, CLabel, CModal, CModalBody, CModalFooter, CModalHeader } from '@coreui/react';
import React, { useContext, useState } from 'react';
import { useCookies } from 'react-cookie';
import SecurityContext from 'src/SecurityContext';

const Profile = () => {

    const { setAuthenticated, user, post } = useContext(SecurityContext);
    const [session, setSession, removeSession] = useCookies(['access']); // eslint-disable-line no-unused-vars
    const [signatureUrl, setSignatureUrl] = useState("/api/user/signature?t=" + session.access);
    const [showDialog, setShowDialog] = useState(false);
    const [password, setPassword] = useState({ old: "", new: "", confirm: "" });

    const logout = () => {
        removeSession("access");
        setAuthenticated(false);
    };

    const handlePreview = (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            setSignatureUrl(URL.createObjectURL(file));
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const form = e.target;
        const data = new FormData(form);
        post("/api/user/update", data)
            .then(response => {
                window.alert('user updated');
                window.location.reload();
            });
    }

    const handleChangePassword = () => {
        if (!password.old) return alert("Please fill current password");
        if (!password.new) return alert("Please fill new password");
        if (!password.confirm) return alert("Please fill confirmation password");
        if (password.new !== password.confirm) return alert("Confirmation password not match!");

        const data = new FormData();
        data.append("old", password.old);
        data.append("new", password.new);
        post("/api/user/change-password", data)
        .then(r => {
            if (r.status === 200) {
                alert("Password updated");
                setShowDialog(false);
            } else {
                alert("Failed to change password");
            }
        })
    };

    return <>
        <form onSubmit={handleSubmit}>
            <CCard>
                <CCardHeader>Profile</CCardHeader>
                <CCardBody>
                    {
                        user &&
                        <div className="bd-example">
                            <dl className="row">
                                <dt className="col-sm-3">Username</dt>
                                <dd className="col-sm-3">{user.username}</dd>

                                <dt className="col-sm-3">Email</dt>
                                <dd className="col-sm-3"><CInput size="sm" type="email" defaultValue={user.email} name="email" /></dd>

                                <dt className="col-sm-3">Name</dt>
                                <dd className="col-sm-3"><CInput size="sm" type="text" defaultValue={user.name} name="name" /></dd>

                                <dt className="col-sm-3">Phone</dt>
                                <dd className="col-sm-3"><CInput size="sm" type="phone" defaultValue={user.phone} name="phone" /></dd>

                                <dt className="col-sm-3">Permissions</dt>
                                <dd className="col-sm-3">
                                    {user.permissions.map(p => <CBadge color="warning" key={p.permission} className="mr-1">{p.permission}</CBadge>)}
                                </dd>

                                <dt className="col-sm-3">Signature</dt>
                                <dd className="col-sm-3"><CInput size="sm" onChange={handlePreview} type="file" accept="image/*" name="signature" /></dd>

                                <dt className="col-sm-3">Roles</dt>
                                <dd className="col-sm-3">
                                    {user.roles.map(r => <CBadge color="primary" key={r.role} className="mr-1">{r.role} - {r.name}</CBadge>)}
                                </dd>

                                <dt className="col-sm-3"></dt>
                                <dd className="col-sm-3"><img alt="Sign Preview" src={signatureUrl} className="bg-gray-200" style={{ width: "100%", height: 150 }} /></dd>

                            </dl>
                        </div>
                    }
                </CCardBody>
                <CCardFooter>
                    <CButton type="submit" color="success" className="mr-2">Save</CButton>
                    <CButton color="warning" className="mr-2" onClick={() => setShowDialog(true)}>Change Password</CButton>
                    <CButton onClick={logout} color="danger">Logout</CButton>
                </CCardFooter>
            </CCard>
        </form>
        <CModal show={showDialog} onClose={() => setShowDialog(false)}>
            <CModalHeader>Change Password</CModalHeader>
            <CModalBody>
                <CFormGroup>
                    <CLabel>Current Password</CLabel>
                    <CInput type="password" onChange={e => setPassword({...password, old: e.target.value})} />
                </CFormGroup>
                <CFormGroup>
                    <CLabel>New Password</CLabel>
                    <CInput type="password" onChange={e => setPassword({...password, new: e.target.value})} />
                </CFormGroup>
                <CFormGroup>
                    <CLabel>Confirm New Password</CLabel>
                    <CInput type="password" onChange={e => setPassword({...password, confirm: e.target.value})} />
                </CFormGroup>
            </CModalBody>
            <CModalFooter>
                <CButton color="primary" onClick={handleChangePassword}>Submit</CButton>
                <CButton color="danger" onClick={() => setShowDialog(false)}>Cancel</CButton>
            </CModalFooter>
        </CModal>
    </>

};

export default Profile;
