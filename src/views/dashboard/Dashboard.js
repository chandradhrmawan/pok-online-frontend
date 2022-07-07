import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow
} from '@coreui/react'
import { CChart } from '@coreui/react-chartjs'
import React, { lazy, useContext, useEffect, useState } from 'react'
import SelectBudgetYear from 'src/reusable/SelectBudgetYear.js'
import SelectLocation from 'src/reusable/SelectLocation.js'
import SecurityContext from 'src/SecurityContext.js'

const WidgetsDropdown = lazy(() => import('../widgets/WidgetsDropdown.js'))
const initial = {tahun_anggaran: null, kdlokasi: null, periode: null};
const Dashboard = () => {
  const { get } = useContext(SecurityContext);
  const [summaries, setSummaries] = useState([]);
  const [ statusCount, setStatusCount ] = useState({});
  const [ pieData, setPieData ] = useState({});
  const [filter, setFilter] = useState({...initial});
  const [qString, setQString] = useState('');
  const [summary, setSummary] = useState({});


  useEffect(() => {
    let str = "";
    Object.keys(filter).forEach(k => {
      const v = filter[k];
      if (v && v.value) {
        str += k + "=" + v.value + "&";
      }
    });

    setQString(str);
  }, [filter]);


  useEffect(() => get("/api/report/summary/pok?" + qString).then(response => setSummaries(response.data)), [get, qString]);
  useEffect(() => get("/api/report/summary/count?" + qString).then(response => setSummary(response.data)), [get, qString]);
  useEffect(() => get("/api/report/summary/status?" + qString).then(response => setStatusCount(response.data)), [get, qString]);
  useEffect(() => {
    if (statusCount) {
      setPieData([{
        data: [
          statusCount.draft,
          statusCount.submitted,
          statusCount.pendingReview,
          statusCount.pendingApprove,
          statusCount.approved,
          statusCount.requiresCorrection,
        ],
        backgroundColor: [
          '#8ecae6',
          '#219ebc',
          '#023047',
          '#ffb703',
          '#fb8500',
          '#e63946',
        ]
      }]);
    }
  }, [statusCount]);

  return (
    <>
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>
              <CRow>
                <CCol><SelectBudgetYear placeholder="Tahun Anggaran" clearable onSelect={o => setFilter({...filter, tahun_anggaran: o})} value={filter.tahun_anggaran} /></CCol>
                <CCol><SelectLocation placeholder="Provinsi" clearable onSelect={o => setFilter({...filter, kdlokasi: o})} value={filter.kdlokasi} /></CCol>
                <CButton color="info" className="mx-3" size="md" onClick={() => setFilter({...initial})}>Clear</CButton>
              </CRow>
            </CCardHeader>
            <CCardBody>
              <WidgetsDropdown summary={summary} />
              <CRow>
                <CCol>
                  <table className="table table-hover table-outline mb-0 d-none d-sm-table">
                    <thead className="thead-light">
                      <tr>
                        <th>Kode Lokasi/ Provinsi</th>
                        <th>Nama Lokasi/ Provinsi</th>
                        <th>Usulan</th>
                        <th>Revisi</th>
                        <th>Total Approved</th>
                        <th>Total Revisi DIPA</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        summaries.map(s => (
                          <tr key={s.lokasiUid}>
                            <td>{s.kdlokasi}</td>
                            <td>{s.nmlokasi}</td>
                            <td><strong>{s.usulan}</strong></td>
                            <td><strong>{s.revisi}</strong></td>
                            <td><strong>{s.totalApproved}</strong></td>
                            <td><strong>{s.totalRevisiDipa}</strong></td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </CCol>
                <CCol sm="5">
                  <CChart
                    type="pie"
                    datasets={pieData}
                    labels={[
                      "Usulan",
                      "Sudah di submit",
                      "Pending Review  by Balai",
                      "Pending Persetujuan",
                      "Telah Disetujui",
                      "Perlu dikoreksi",
                    ]}

                  />
                </CCol>
              </CRow>

            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
