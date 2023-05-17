import CIcon from "@coreui/icons-react";
import {
    CAlert,
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CDataTable,
    CDropdown,
    CDropdownItem,
    CDropdownMenu,
    CDropdownToggle,
    CFormGroup,
    CInputCheckbox,
    CLabel,
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CModalTitle,
    CTextarea,
    CTabs,
    CNav,
    CNavItem,
    CNavLink,
    CTabPane,
    CTabContent,
    CInputFile,
    CInput
} from "@coreui/react";
import JSZip from "jszip";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { InputSelect } from "src/components";
import ApprovalStatus from "src/reusable/ApprovalStatus";
import SecurityContext from "src/SecurityContext";

const actionConfigs = {
    'SUBMIT_REVIEW': { action: 'SUBMIT_REVIEW', title: 'Submit to Balai', message: 'Apakah anda sudah yakin untuk mengirimkan POK ini ke Balai?' },
    'SUBMIT_APPROVAL': { action: 'SUBMIT_APPROVAL', title: 'Submit for Approval', message: 'Apakah anda sudah yakin untuk mengirimkan POK ini untuk proses persetujuan?' },
    'REQUEST_CORRECTION': { action: 'REQUEST_CORRECTION', title: 'Request for Correction', message: 'Apakah anda sudah yakin untuk meminta koreksi terhadap POK ini?' },
    'APPROVE': { action: 'APPROVE', title: 'Approve', message: 'Apakah anda sudah yakin untuk menyetujui POK ini?' },
};

const dialogLabels = {
    null: {},
    'NEW': { title: "Create New Revision", message: "Anda akan melakukan upload revisi untuk periode selanjutnya", success: "Revision created successfully" },
    'APPEND': { title: "Create New DS Revision", message: "Anda akan melakukan upload revisi DS untuk periode ini", success: "Revision created successfully" },
    'REPLACE': { title: "Create New Correction", message: "Anda akan melakukan penggantian data untuk periode ini", success: "Data replaced successfully" },
};

const PokInfo = ({ uid, onLoaded, onActionCompleted }) => {
    const [session] = useCookies(['access']);
    const { get, post, user } = useContext(SecurityContext);
    const [revision, setRevision] = useState({ actionable: [], reviewers: [], officers: [] });
    const [showAction, setShowAction] = useState(false);
    const [actionConfig, setActionConfig] = useState({});
    const [reviewers, setReviewers] = useState([]);
    const [reviewer, setReviewer] = useState(null);
    const [users, setUsers] = useState([]);
    const [alert, setAlert] = useState(false);
    const [flows, setFlows] = useState([]);
    const [dialogRevision, setDialogRevision] = useState(null);
    const [zipContent, setZipContent] = useState([]);
    const [zip, setZip] = useState(null);
    const [notes, setNotes] = useState();
    const [koordinats, setKoordinats] = useState([]);
    const [duplicateKoordinats, setDuplicateKoordinats] = useState([]);
    const [histories, setHistories] = useState([]);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [documents, setDocuments] = useState(null);
    const [documentList, setDocumentList] = useState([]);

    const [error, setError] = useState();
    const [bussy, setBussy] = useState(false);
    const fileUpload = useRef(null);

    const [lembarKontrol, setLembarKontrol] = useState(null);
    const [rencanaKerja, setRencanaKerja] = useState(null);
    const [strukturKegiatan, setStrukturKegiatan] = useState(null);
    const [lingkupKegiatan, setLingkupKegiatan] = useState(null);
    const [rincianKegiatan, setRincianKegiatan] = useState(null);
    const [koordinatKegiatan, setKoordinatKegiatan] = useState(null);
    const [isFormValid, setIsFormValid] = useState(false);

    const handlePdfChange = (event, setter) => {
        const file = event.target.files[0];
        setter(file);
    };

    const handleSave = () => {
        const data = new FormData();
        data.append("revisionUid", lembarKontrol);
        data.append("lembarKontrol", lembarKontrol);
        data.append("rencanaKerja", rencanaKerja);
        data.append("strukturKegiatan", strukturKegiatan);
        data.append("lingkupKegiatan", lingkupKegiatan);
        data.append("rincianKegiatan", rincianKegiatan);
        data.append("koordinatKegiatan", koordinatKegiatan);

        // store data ke API
        fetch("pok/upload/file", {
            method: "POST",
            body: data,
        }).then((response) => {
            console.log(response);
        });
    };

    useEffect(() => {
        setIsFormValid(
            lembarKontrol &&
            rencanaKerja &&
            strukturKegiatan &&
            lingkupKegiatan &&
            rincianKegiatan &&
            koordinatKegiatan
        );
    }, [
        lembarKontrol,
        rencanaKerja,
        strukturKegiatan,
        lingkupKegiatan,
        rincianKegiatan,
        koordinatKegiatan,
    ]);


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

    const showRevisionDialog = (mode) => {
        fileUpload.current.value = '';
        setError(null);
        setAlert(null);
        setZip(null);
        setZipContent([]);
        setDialogRevision(mode);
    };

    const createRevision = () => {
        setBussy(true);
        const data = new FormData();
        data.append("kdsatker", revision.kdsatker);
        data.append("kdlokasi", revision.kdlokasi);
        data.append("thang", revision.budgetYear);
        data.append("periode", dialogRevision === "NEW" ? (Number(revision.semester) + 1) : revision.semester);
        data.append("dbfile", zip);
        data.append("mode", dialogRevision);
        if (documents) {
            data.append("document", documents[0]);
        }

        post("/api/pok/create", data).then(r => {
            setDialogRevision(null);
            if (r.data) {
                onActionCompleted({ revisionId: r.data.revisionId });
                setAlert(dialogLabels[dialogRevision].success);
            } else {
                setAlert("Failed to create revision");
            }
        }).catch(e => {
            setAlert(e.message);
            loadRevision();
        }).finally(() => setBussy(false));
    }

    const approveKoordinat = (id) => {
        if (window.confirm("Approve Koordinat ?")) {
            post("/api/pok/koordinat/approve?koordinatId=" + id)
                .then(response => handleTabChanged("KOORDINAT"));
        }
    };

    const uploadKoordinat = (id) => {
        if (window.confirm("Re-Upload Koordinat ?")) {
            post("/api/pok/koordinat/upload?koordinatId=" + id)
                .then(response => handleTabChanged("KOORDINAT"));
        }
    };

    const showConfirm = (action) => {
        setShowAction(true);
        setActionConfig(actionConfigs[action]);
    };

    const loadRevision = () => {
        get(`/api/pok/details?id=${uid}`).then(response => setRevision(response.data));
    };

    const executeAction = () => {
        const data = new FormData();
        data.append('action', actionConfig.action);
        data.append('id', revision.id);
        data.append('notes', notes);
        if (users) {
            users.forEach(u => data.append('destinationUsers', u));
        }
        if (documents) {
            data.append("document", documents[0]);
        }
        post('/api/pok/route', data)
            .then(r => {
                setAlert("POK submitted succesfully");
                setShowAction(false);
                loadRevision();
            })
    };

    const handleSelectApproval = (e) => {
        const checked = e.target.checked;
        const value = e.target.value;
        const modified = [...users];
        const idx = modified.indexOf(value);
        if (idx > -1 && !checked) {
            modified.splice(idx, 1);
        } else if (idx < 0 && checked) {
            modified.push(value);
        }

        setUsers(modified);
    };

    const handleChangeSelect = (val) => {
        setReviewer(val)
    }

    const handleTabChanged = (tabName) => {
        switch (tabName) {
            case "HISTORY": get(`/api/pok/history?revisionId=${uid}`).then(response => setHistories(response.data)); break;
            case "KOORDINAT": get(`/api/pok/koordinat?revisionId=${uid}`).then(response => setKoordinats(response.data)); break;
            case "DUPLICATE": get(`/api/pok/koordinat-duplicate?revisionId=${uid}`).then(response => setDuplicateKoordinats(response.data)); break;
            case "DOCUMENTS": get(`/api/pok/documents?revisionId=${uid}`).then(response => setDocumentList(response.data)); break;
            default: console.log("Unknown Tab");
        }
    }

    useEffect(loadRevision, [get, uid]);

    useEffect(() => {
        get("/api/references/approval-flows")
            .then(r => {
                setFlows(r.data);
                setUsers(r.data.map(u => u.id));
            })
    }, [get]);

    useEffect(() => {
        const revs = revision.reviewers.map(r => ({ label: r.name, value: r.id }));
        setReviewers(revs);
        if (revs.length > 0) {
            setReviewer(revs[0]);
        } else {
            setReviewer(null);
        }
    }, [revision]);

    useEffect(() => {
        if (onLoaded) {
            onLoaded(revision, histories);
        }
    }, [revision, onLoaded, histories]);

    useEffect(() => {
        if (user && revision) {
            if (user.permissions.find(p => p.permission === 'REVIEWER') && user.kdlokasi.includes(revision.kdlokasi)) {
                setIsAuthorized(true);
            }
        }
    }, [user, revision]);

    return <>
        <CTabs activeTab="INFO" onActiveTabChange={handleTabChanged}>
            <CCard>
                <CCardHeader>
                    Informasi POK
                    {revision.id &&
                        <div className="card-header-actions">
                            <CDropdown className="m-1 btn-group">
                                <CDropdownToggle color="primary" disabled={revision.actionable.length === 0}>
                                    Actions
                                </CDropdownToggle>
                                <CDropdownMenu>
                                    {revision.actionable.includes('SUBMIT_REVIEW') && <CDropdownItem onClick={e => showConfirm('SUBMIT_REVIEW')}>Submit to Balai</CDropdownItem>}
                                    {revision.actionable.includes('SUBMIT_APPROVAL') && <CDropdownItem onClick={e => showConfirm('SUBMIT_APPROVAL')}>Submit for Approval</CDropdownItem>}
                                    {revision.actionable.includes('REQUEST_CORRECTION') && <CDropdownItem onClick={e => showConfirm('REQUEST_CORRECTION')}>Request for Correction</CDropdownItem>}
                                    {revision.actionable.includes('APPROVE') && <CDropdownItem onClick={e => showConfirm('APPROVE')}>Approve</CDropdownItem>}
                                    {/* {revision.actionable.includes('REPLACE_DATA') && <CDropdownItem onClick={e => showRevisionDialog('REPLACE')}>Replace Data</CDropdownItem>}
                                    {revision.actionable.includes('CREATE_REVISION') && <CDropdownItem onClick={e => showRevisionDialog('NEW')}>Create Revision</CDropdownItem>}
                                    {revision.actionable.includes('CREATE_DS_REVISION') && <CDropdownItem onClick={e => showRevisionDialog('APPEND')}>Create POK Revision</CDropdownItem>} */}
                                </CDropdownMenu>
                            </CDropdown>
                        </div>
                    }
                </CCardHeader>
                <CCardBody className="pt-0">
                    <CNav variant="tabs">
                        <CNavItem>
                            <CNavLink data-tab="INFO">Details</CNavLink>
                        </CNavItem>
                        <CNavItem>
                            <CNavLink data-tab="NOTES">Notes</CNavLink>
                        </CNavItem>
                        <CNavItem>
                            <CNavLink data-tab="HISTORY">History</CNavLink>
                        </CNavItem>
                        <CNavItem>
                            <CNavLink data-tab="KOORDINAT">Status Koordinat</CNavLink>
                        </CNavItem>
                        {
                            duplicateKoordinats && duplicateKoordinats.length > 0 &&
                            <CNavItem>
                                <CNavLink data-tab="DUPLICATE">Double Koordinat</CNavLink>
                            </CNavItem>
                        }
                        <CNavItem>
                            <CNavLink data-tab="DOCUMENTS">Documents</CNavLink>
                        </CNavItem>
                        <CNavItem>
                            <CNavLink data-tab="UPLOAD_PDF">Upload Laporan</CNavLink>
                        </CNavItem>
                    </CNav>
                    {revision.id &&
                        <CTabContent>
                            <CTabPane data-tab="INFO">
                                <div className="mt-4">
                                    <dl className="row">
                                        <dt className="col-sm-3">Provinsi</dt>
                                        <dd className="col-sm-9">{revision.lokasi}</dd>

                                        <dt className="col-sm-3">Satker</dt>
                                        <dd className="col-sm-9">{revision.kdsatker} - {revision.satker}</dd>

                                        <dt className="col-sm-3">Program</dt>
                                        <dd className="col-sm-9">{revision.program}</dd>

                                        <dt className="col-sm-3">TA</dt>
                                        <dd className="col-sm-3">{revision.budgetYear}</dd>

                                        <dt className="col-sm-3">Semester Data</dt>
                                        <dd className="col-sm-3">{revision.semester}</dd>

                                        <dt className="col-sm-3">Status Koordinat</dt>
                                        <dd className="col-sm-3">{revision.coordinateStatus}</dd>

                                        <dt className="col-sm-3">Status Data</dt>
                                        <dd className="col-sm-3">{revision.revisionType}</dd>
                                        <dt className="col-sm-3">Status Persetujuan POK</dt>
                                        <dd className="col-sm-3">{revision.statusName}</dd>

                                        <dt className="col-sm-3">Owner</dt>
                                        <dd className="col-sm-3">{revision.owner}</dd>

                                        <dt className="col-sm-3">Kode Digital Stamp</dt>
                                        <dd className="col-sm-3">{revision.letterNumber}</dd>

                                        <dt className="col-sm-3">Tanggal Surat</dt>
                                        <dd className="col-sm-3">{revision.letterDate}</dd>

                                    </dl>
                                    {(revision.status === "Pending Approve" || revision.status === "Approved") && <ApprovalStatus revision={revision} />}
                                </div>
                            </CTabPane>
                            <CTabPane data-tab="NOTES">
                                <div className="alert alert-warning mt-4">
                                    <h5 className="alert-heading">Correction Notes</h5>
                                    {revision.notes}
                                </div>
                            </CTabPane>
                            <CTabPane data-tab="HISTORY">
                                <CDataTable items={histories} fields={[{ key: "budgetYear", label: "TA" }, "semester", "statusName"]} />
                            </CTabPane>
                            <CTabPane data-tab="KOORDINAT">
                                <CDataTable
                                    items={koordinats}
                                    fields={[
                                        "uploadDate",
                                        "kdsatker",
                                        { key: "thang", label: "TA" },
                                        { key: "dsStatus", label: "POK Status" },
                                        "uploadedStatus",
                                        "approvedBalaiDate",
                                        "approvedDate",
                                        "status",
                                        "comments",
                                        "action",
                                    ]}
                                    scopedSlots={{
                                        'status': item => <td>{item.status}</td>,
                                        'action': item => {
                                            if (isAuthorized) {
                                                if (!item.ready) {
                                                    return <td><i><small className="text-warning">Data koordinat tidak tersedia</small></i></td>;
                                                } else if (item.uploadedStatus !== 'success') {
                                                    return <td><CButton variant="outline" color="success" size="sm" onClick={() => uploadKoordinat(item.uid)}>Re-Upload</CButton></td>;
                                                } else if (!item.approvedBalaiDate && item.uploadedStatus === 'success') {
                                                    return <td><CButton variant="outline" color="primary" size="sm" onClick={() => approveKoordinat(item.uid)}>Submit Approval</CButton></td>;
                                                }
                                            }

                                            return <td></td>;
                                        }
                                    }}
                                />
                            </CTabPane>
                            <CTabPane data-tab="DUPLICATE">
                                <CDataTable
                                    items={duplicateKoordinats}
                                    fields={[
                                        "status",
                                        "kodeKegiatan",
                                        "desk",
                                        "namaPpk",
                                        "indikasi",
                                        "noJbtn",
                                        "snfVol",
                                        "panjang",
                                        "namaLinkname",
                                        "total",
                                    ]}
                                />
                            </CTabPane>
                            <CTabPane data-tab="DOCUMENTS">
                                <CDataTable
                                    items={documentList}
                                    fields={[
                                        "fileName",
                                        "fileType",
                                        "creator",
                                        "createdDate",
                                        "action",
                                    ]}
                                    scopedSlots={{
                                        "creator": item => <td>{item.creator.fullName}</td>,
                                        "action": item => <td><CButton variant="outline" color="success" size="sm" onClick={() => window.open(`/api/pok/download-document?t=${session.access}&id=${item.uid}`, '_blank')}>Download</CButton></td>
                                    }}
                                />
                            </CTabPane>
                            <CTabPane data-tab="UPLOAD_PDF">
                                <div className="mt-4">
                                    <dl className="row">
                                        <dt className="col-sm-3">1. Lembar Kontrol (PDF)</dt>
                                        <dd className="col-sm-9">
                                            <CInput size="sm" type="file" accept="pdf/*" name="lembar_kontrol" id="lembar_kontrol"
                                                onChange={(event) => handlePdfChange(event, setLembarKontrol)} />
                                        </dd>

                                        <dt className="col-sm-3">2. Rencana Kerja (PDF)</dt>
                                        <dd className="col-sm-9">
                                            <CInput size="sm" type="file" accept="pdf/*" name="rencana_kerja" id="rencana_kerja"
                                                onChange={(event) => handlePdfChange(event, setRencanaKerja)} />
                                        </dd>

                                        <dt className="col-sm-3">3. Struktur Kegiatan (PDF)</dt>
                                        <dd className="col-sm-9">
                                            <CInput size="sm" type="file" accept="pdf/*" name="struktur_kegiatan" id="struktur_kegiatan"
                                                onChange={(event) => handlePdfChange(event, setStrukturKegiatan)} />
                                        </dd>


                                        <dt className="col-sm-3">4. Lingkup Kegiatan (PDF)</dt>
                                        <dd className="col-sm-9">
                                            <CInput size="sm" type="file" accept="pdf/*" name="lingkup_kegiatan" id="lingkup_kegiatan"
                                                onChange={(event) => handlePdfChange(event, setLingkupKegiatan)} />
                                        </dd>


                                        <dt className="col-sm-3">5. Rincian Kegiatan (PDF)</dt>
                                        <dd className="col-sm-9">
                                            <CInput size="sm" type="file" accept="pdf/*" name="rincian_kegiatan" id="rincian_kegiatan"
                                                onChange={(event) => handlePdfChange(event, setRincianKegiatan)} />
                                        </dd>


                                        <dt className="col-sm-3">6. Koordinat Lokasi(PDF)</dt>
                                        <dd className="col-sm-9">
                                            <CInput size="sm" type="file" accept="pdf/*" name="koordinat_kegiatan" id="koordinat_kegiatan"
                                                onChange={(event) => handlePdfChange(event, setKoordinatKegiatan)} />
                                        </dd>

                                        <dd className="col-sm-12">
                                            <CButton color="primary" size="sm" align="left" onClick={handleSave} disabled={!isFormValid}>Save</CButton>
                                        </dd>
                                    </dl>
                                </div>
                            </CTabPane>
                        </CTabContent>
                    }
                    <CAlert color="info" show={!!alert} closeButton onClose={() => setAlert(null)}>{alert}</CAlert>
                </CCardBody>
            </CCard>
        </CTabs>
        <CModal show={showAction} onClose={() => setShowAction(false)} closeOnBackdrop={false} size="lg" color="warning">
            <CModalHeader>
                <CModalTitle>{actionConfig.title}</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <p>{actionConfig.message}</p>
                {revision.id && actionConfig.action === 'SUBMIT_APPROVAL' && revision.status === 'Pending Review' &&
                    <div>
                        <CFormGroup row>
                            <CCol md="4"><CLabel>Eselon III :</CLabel></CCol>
                            <CCol md="4"><CLabel>Eselon II :</CLabel></CCol>
                            <CCol md="4"><CLabel>Eselon I :</CLabel></CCol>
                        </CFormGroup>
                        {
                            flows.map((r, i) =>
                                <CFormGroup row key={r.id}>
                                    <CCol md="4">
                                        <CFormGroup variant="checkbox" className="checkbox">
                                            <CInputCheckbox name={r.id} id={r.id} value={r.id} checked={users.indexOf(r.id) > -1} onChange={handleSelectApproval} />
                                            <CLabel variant="checkbox" className="form-check-label" htmlFor={r.id}>
                                                {r.eselonThree}
                                                <p className="text-value-xs" style={{ fontSize: 9 }}>{r.eselonThreeRole}</p>
                                            </CLabel>
                                        </CFormGroup>
                                    </CCol>
                                    <CCol md="4">
                                        <CFormGroup variant="checkbox" className="checkbox">
                                            <CInputCheckbox name={r.id} checked={users.indexOf(r.id) > -1} disabled />
                                            <CLabel variant="checkbox" className="form-check-label">
                                                {r.eselonTwo}
                                                <p className="text-value-xs">{r.eselonTwoRole}</p>
                                            </CLabel>
                                        </CFormGroup>
                                    </CCol>
                                    {
                                        i === 0 &&
                                        <CCol md="4">
                                            <CFormGroup variant="checkbox" className="checkbox">
                                                <CInputCheckbox name={r.id} disabled checked={users.length > 0} />
                                                <CLabel variant="checkbox" className="form-check-label">
                                                    {r.eselonOne}
                                                    <p className="text-value-xs">{r.eselonOneRole}</p>
                                                </CLabel>
                                            </CFormGroup>
                                        </CCol>
                                    }
                                </CFormGroup>
                            )
                        }
                    </div>
                }
                {revision.id && revision.status === 'New' &&
                    <CFormGroup>
                        <CLabel>Reviewer :</CLabel>
                        <InputSelect options={reviewers} value={reviewer} onSelect={handleChangeSelect} />
                    </CFormGroup>
                }
                {
                    revision.id && actionConfig.action === 'REQUEST_CORRECTION' &&
                    <CFormGroup>
                        <CLabel>Notes :</CLabel>
                        <CTextarea onChange={e => setNotes(e.target.value)} value={notes} />
                    </CFormGroup>
                }
                {
                    actionConfig.action !== 'SUBMIT_REVIEW' && revision.coordinateStatus === 'Belum disetujui' &&
                    <CAlert color="warning">Terdapat koordinat yang belum disetujui</CAlert>
                }
                {
                    actionConfig.action !== 'SUBMIT_REVIEW' && duplicateKoordinats && duplicateKoordinats.length > 0 &&
                    <CAlert color="info">Terdapat double koordinat</CAlert>
                }
                {
                    (actionConfig.action === 'SUBMIT_REVIEW' || (actionConfig.action === 'SUBMIT_APPROVAL' && revision.status === 'Pending Review')) &&
                    <CFormGroup>
                        <CLabel>Surat Pengesahan Balai :</CLabel>
                        <CInputFile onChange={e => setDocuments(e.target.files)} />
                    </CFormGroup>
                }
            </CModalBody>
            <CModalFooter>
                <CButton color="danger" onClick={executeAction}>Continue <CIcon size="sm" name="cil-arrow-thick-right" /></CButton>{' '}
                <CButton color="default" onClick={() => setShowAction(false)}>Cancel</CButton>
            </CModalFooter>
        </CModal>
        <CModal show={!!dialogRevision} onClose={() => setDialogRevision(null)} size="lg" closeOnBackdrop={false}>
            <CModalHeader>
                <CModalTitle>{dialogLabels[dialogRevision].title}</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CFormGroup row>
                    <CLabel className="col-md-3">Browse File (.zip)</CLabel>
                    <label className="col-md-2 btn btn-warning btn-md mr-2 mt-1">
                        <input type="file" style={{ display: "none" }} accept=".zip" onChange={fileSelected} ref={fileUpload}></input>
                        <CIcon name="cil-folder" size="sm" /> Browse
                    </label>
                </CFormGroup>
                <CDataTable
                    items={zipContent}
                    hover
                    striped
                />
                {
                    error && <CAlert color="danger">{error}</CAlert>
                }
                {
                    dialogRevision === 'NEW' &&
                    <CFormGroup>
                        <CLabel>Dokumen Pendukung :</CLabel>
                        <CInputFile onChange={e => setDocuments(e.target.files)} />
                    </CFormGroup>
                }
            </CModalBody>
            <CModalFooter>
                <CButton disabled={!zip || bussy} color="primary" size="md" onClick={createRevision}>{dialogRevision === 'REPLACE' ? "Replace Data" : "Create Revision"}</CButton>
                <CButton size="md" color="danger" variant="outline" onClick={() => setDialogRevision(null)}>Cancel</CButton>
            </CModalFooter>
        </CModal>
    </>
};

export default PokInfo;