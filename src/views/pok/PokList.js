import CIcon from "@coreui/icons-react";
import { CButton, CCard, CCardBody, CCol, CPagination, CRow } from "@coreui/react";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SecurityContext from "src/SecurityContext";
import PokFilter from "./PokFilter";

const PokList = () => {
    const { post } = useContext(SecurityContext);
    const [list, setList] = useState([]);
    const [filter, setFilter] = useState({});
    const [pagination, setPagination] = useState({ page: 1, size: 10 });
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const q = {};
        if (filter.lokasi) { q["lok.kdlokasi"] = filter.lokasi.value }
        if (filter.satker) { q["sat.kdsatker"] = filter.satker.value }
        if (filter.thang) { q["pok.thang"] = filter.thang.value + "" }
        if (filter.koordinatStatus) { q["koorstat.koordinatStatus"] = filter.koordinatStatus.value }
        if (filter.revstat) { q["revstat.id"] = filter.revstat.value }
        if (filter.revisionSeqNo) { q["rev.revisionSeqNo"] = Number(filter.revisionSeqNo.value) }
        post(`/api/pok/list?page=${pagination.page > 0 ? (pagination.page - 1) : 0}&size=${pagination.size}`, q)
            .then(response => {
                setList(response.data.content)
                setTotalPages(response.data.totalPages)
            })
    }, [post, pagination, filter])

    return <>
        <CRow>
            <CCol>
                <PokFilter onFilterChanged={setFilter} />
            </CCol>
        </CRow>
        <CRow>
            <CCol>
                <CCard>
                    <CCardBody>

                        <table className="table table-hover table-outline mb-0 d-none d-sm-table">
                            <thead className="thead-light">
                                <tr>
                                    <th>Provinsi</th>
                                    <th>SATKER</th>
                                    <th>TA</th>
                                    <th>Status Data</th>
                                    <th>Status</th>
                                    <th>Detail</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    list.map(r => (
                                        <tr key={r.id}>
                                            <td>{r.lokasi}</td>
                                            <td>{r.kdsatker} - {r.satker}</td>
                                            <td>{r.budgetYear}</td>
                                            <td>{r.revisionTypeName} {r.semester === '0' ? '' : r.semester}</td>
                                            <td>{r.status}</td>
                                            <td>
                                                <Link to={"/pok/details/" + r.id}>
                                                    <CButton color="primary" variant="ghost">
                                                        <CIcon name="cil-external-link"/>
                                                    </CButton>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        <br />
                        <CPagination
                            activePage={pagination.page}
                            onActivePageChange={page => setPagination({ ...pagination, page })}
                            pages={totalPages}
                            doubleArrows={false}
                            align="center"
                        />
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    </>
};

export default PokList;