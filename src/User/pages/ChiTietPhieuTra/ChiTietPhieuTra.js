import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './ChiTietPhieuTra.module.scss';

const cx = classNames.bind(styles);

function ChiTietPhieuTra() {
    let { id } = useParams();


    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tacgias, setTacgias] = useState([]);
    const [phieumuons, setPhieuMuons] = useState([]);
    const [phieutras, setPhieuTras] = useState([]);

    useEffect(() => {
        const fetchPhieuMuon = async () => {
            try {
                const response = await fetch(`https://localhost:44315/api/QuanLyPhieuMuon/ByPmId/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setPhieuMuons(data[0]);
                    setLoading(false);
                } else {
                    throw new Error('Failed to fetch data');
                }
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };
        const fetchPhieuTra = async () => {
            try {
                const response = await fetch(`https://localhost:44315/api/QuanLyPhieuTra/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setPhieuTras(data[0]);
                    setLoading(false);
                } else {
                    throw new Error('Failed to fetch data');
                }
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        const fetchTacGia = async () => {
            try {
                const response = await fetch("https://localhost:44315/api/TacGia");
                if (response.ok) {
                    const data = await response.json();
                    setTacgias(data);
                } else {
                    throw new Error('Failed to fetch authors');
                }
            } catch (error) {
                console.error('Error fetching authors:', error);
            }
        };


        fetchPhieuMuon();
        fetchPhieuTra();
        fetchTacGia();


    }, [id]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }



    return (
        <div className={cx('wrapper')}>
            <div className="row m-5 ">


                <div className="col-md-6">
                    <div className='text-start'>
                        {phieumuons && (
                            <> <h2 className='text-center'>Thông tin mượn</h2>
                                <table className="table table-bordered fs-3">
                                    <tbody>
                                        <tr >
                                            <th scope="row">Số phiếu</th>
                                            <td > {phieumuons.Id_PhieuMuon}</td>

                                        </tr >
                                        <tr >
                                            <th scope="row">Tên sách: </th>
                                            <td>{phieumuons.TenSach}</td>

                                        </tr>
                                        <tr>
                                            <th scope="row">Số lượng sách:</th>
                                            <td>{phieumuons.SoLuongSach}</td>

                                        </tr>
                                        <tr>
                                            <th scope="row">Trạng thái:</th>
                                            <td > {phieumuons.TrangThai}</td>

                                        </tr>
                                        <tr>
                                            <th scope="row">Ngày mượn:</th>
                                            <td > {new Date(phieumuons.NgayMuon).toLocaleDateString('en-GB')}</td>

                                        </tr>
                                        <tr>
                                            <th scope="row">Hạn trả sách:</th>
                                            <td >  {new Date(phieumuons.HanTra).toLocaleDateString('en-GB')}</td>

                                        </tr>

                                    </tbody>
                                </table>
                            </>
                        )}
                    </div>
                </div>
                <div className="col-md-6">
                    <div className='text-start'>
                        {phieutras && (
                            <>
                                <h2 className='text-center'>Thông tin trả</h2>
                                <table className="table table-bordered fs-3">
                                    <tbody>
                                        <tr >
                                            <th scope="row">Số phiếu</th>
                                            <td >  {phieutras.PtId}</td>

                                        </tr >
                                        <tr>
                                            <th scope="row">Ngày Trả: </th>
                                            <td >  {new Date(phieutras.PtNgayTra).toLocaleDateString('en-GB')}</td>

                                        </tr>
                                        <tr>
                                            <th scope="row">Số lượng sách trả:</th>
                                            <td >  {phieutras.CtptSoLuongSachTra}</td>

                                        </tr>
                                        <tr>
                                            <th scope="row">Số ngày trễ hạn:</th>
                                            <td className='text-danger fw-bold'>
                                                {phieutras.SoNgayTre <= 0 ? "Đúng hạn" : `${phieutras.SoNgayTre} ngày (Trễ hạn)`}
                                            </td>

                                        </tr>

                                    </tbody>
                                </table>

                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>

    );
}


export default ChiTietPhieuTra;
