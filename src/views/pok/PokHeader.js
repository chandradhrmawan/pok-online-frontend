import React from 'react';
import LogoMini from '../../assets/logo_square.png';

const PokHeader = ({ revision }) => {
    return <table style={{ width: "100%", fontSize: 11 }}>
        <tbody>
        <tr>
            <td style={{ width: 128, textAlign: "center", verticalAlign: "top" }}>
                <img src={LogoMini} width={80} alt="PUPR" />
            </td>
            <td>
                {revision.id &&
                    <div className="bd-example">
                        <dl className="row">
                            <dt className="col-sm-1">Kode Satker</dt>
                            <dd className="col-sm-11">{revision.kdsatker}</dd>

                            <dt className="col-sm-1">Nama Satker</dt>
                            <dd className="col-sm-5">{revision.satker}</dd>

                            <dt className="col-sm-6 text-right">Kode DS : RKAKL {revision.letterNumber}</dt>

                            <dt className="col-sm-1">Provinsi</dt>
                            <dd className="col-sm-5">{revision.lokasi}</dd>

                            <dt className="col-sm-6 text-right">Tanggal DIPA : {revision.letterDate}</dt>

                            <dt className="col-sm-1">Program</dt>
                            <dd className="col-sm-5">{revision.program}</dd>

                            <dt className="col-sm-6 text-right">Kode DS : POK {revision.pokNumber}</dt>
                        </dl>
                    </div>
                }
            </td>
        </tr>
        </tbody>
    </table>
};
export default PokHeader;