import { CBadge } from "@coreui/react";
import React, { useContext, useEffect, useState } from "react";
import SecurityContext from "src/SecurityContext";

const ApprovalStatus = ({ revision }) => {
    const { get } = useContext(SecurityContext);
    const [list, setList] = useState([]);

    useEffect(() => get("/api/pok/approval-status?revisionId=" + revision.id).then(r => setList(r.data)), [get, revision]);

    return <>
        <p className="font-weight-bold mb-1">Status Persetujuan</p>
        <table className="table table-sm table-striped" style={{width: "100%"}}>
            <thead>
                <tr>
                    <th style={{width: 200}}>Nama</th>
                    <th>Jabatan</th>
                    <th className="text-xl-center">Menyetujui</th>
                    <th style={{width: 200}}>Tanggal Persetujuan</th>
                </tr>
            </thead>
            <tbody>
                {
                    list.map(a => 
                        <tr key={a.id}>
                            <td>{a.name}</td>
                            <td className="text-value-sm">{a.roles.reduce((a,b) => a + "," + b)}</td>
                            <td className="text-xl-center">
                                {
                                    a.approved 
                                        ? <CBadge className="p-1" color="success">Ya</CBadge>
                                        : <CBadge className="p-1" color="dark">Belum</CBadge>
                                }
                            </td>
                            <td>{a.approvalDate ? new Date(a.approvalDate).toLocaleString() : ""}</td>
                        </tr>
                    )
                }
            </tbody>
        </table>
    </>
};

export default ApprovalStatus;