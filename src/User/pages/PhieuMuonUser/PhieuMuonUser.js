import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './PhieuMuonUser.module.scss';
import { jwtDecode } from 'jwt-decode';

const cx = classNames.bind(styles);

function PhieuMuonUser() {
    let { id } = useParams(); // Lấy id sách từ URL
    let jwttoken = sessionStorage.getItem('jwttoken');


    const [user, setUser] = useState(null);
    const [sach, setSach] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tacgias, setTacgias] = useState([]);
    const [nxbs, setNxbs] = useState([]);
    const [kes, setKes] = useState([]);
    const [os, setOs] = useState([]);
    const [ngayMuon, setNgayMuon] = useState(new Date().toISOString().substr(0, 10)); // Ngày mượn là ngày hiện 
    const [ngayMuonSet, setNgayMuonSet] = useState(false);
    const [ngayHanTra, setNgayHanTra] = useState(() => {
        const hanTra = new Date();
        hanTra.setDate(hanTra.getDate() + 14); // Hạn trả là 14 ngày sau ngày hiện tại
        return hanTra.toISOString().substr(0, 10);
    });
    const [soLuongNhap, setSoLuongNhap] = useState(1); // Số lượng nhập vào, mặc định là 1
    const [soLuongTrongKho, setSoLuongTrongKho] = useState(0); // Số lượng sách trong kho

    useEffect(() => {
        const decodedToken = jwtDecode(jwttoken);
        const userId = decodedToken.nameid;

        const fetchUser = async () => {
            try {
                const response = await fetch(`https://localhost:44315/api/NguoiDung/${userId}`);
                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData[0]);
                    setLoading(false);
                } else {
                    throw new Error('Failed to fetch user data');
                }
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };
        // Thiết lập ngày mượn mặc định nếu chưa được thiết lập
        if (!ngayMuonSet) {
            setNgayMuon(new Date().toISOString().substr(0, 10));
            setNgayMuonSet(true);
        }
        const fetchSach = async () => {
            try {
                const response = await fetch(`https://localhost:44315/api/Sach/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setSach(data[0]);
                    setSoLuongTrongKho(data[0].s_SoLuong);
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

        const fetchNXB = async () => {
            try {
                const response = await fetch("https://localhost:44315/api/NhaXuatBan");
                if (response.ok) {
                    const data = await response.json();
                    setNxbs(data);
                } else {
                    throw new Error('Failed to fetch nxb');
                }
            } catch (error) {
                console.error('Error fetching nxbs:', error);
            }

        };

        const fetchKe = async () => {
            try {
                const response = await fetch("https://localhost:44315/api/KeSach");
                if (response.ok) {
                    const data = await response.json();
                    setKes(data);
                } else {
                    throw new Error('Failed to fetch ke');
                }
            } catch (error) {
                console.error('Error fetching kes:', error);
            }
        };

        const fetchO = async () => {
            try {
                const response = await fetch("https://localhost:44315/api/OSach");
                if (response.ok) {
                    const data = await response.json();
                    setOs(data);
                } else {
                    throw new Error('Failed to fetch o');
                }
            } catch (error) {
                console.error('Error fetching os:', error);
            }
        };

        fetchSach();
        fetchTacGia();
        fetchNXB();
        fetchKe();
        fetchO();
        fetchUser();
    }, [id, jwttoken, ngayMuonSet]);

    const isValidSoLuong = () => {
        return soLuongNhap <= soLuongTrongKho && soLuongNhap >= 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('https://localhost:44315/api/PhieuMuon', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    pmNgayMuon: ngayMuon,
                    pmHanTra: ngayHanTra,
                    pmTrangThai: 'Đang mượn',
                    ndId: user.nd_Id,
                    chiTietPhieuMuons: [{
                        sId: sach.s_Id,
                        ctpmSoLuongSachMuon: soLuongNhap,
                    }]
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to submit data');
            }
            // Show success notification
            alert('Submit successful');
            // Redirect to "/quanlyphieumuon"
            window.location.href = '/quanlyphieumuon';
        } catch (error) {
            console.error('Error submitting data:', error);
            // Handle error
            // Show error message or retry
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    const getAuthorNameById = (tg_Id) => {
        const author = tacgias.find(author => author.tg_Id === tg_Id);
        return author ? author.tg_TenTacGia : "Unknown Author";
    };

    const getNXBNameById = (nxb_Id) => {
        const nxb = nxbs.find(nxb => nxb.nxb_Id === nxb_Id);
        return nxb ? nxb.nxb_TenNhaXuatBan : "Unknown NXB";
    };

    const getKeById = (ks_Id) => {
        const k = kes.find(k => k.ks_Id === ks_Id);
        return k ? k.ks_TenKe : "Unknown Ke";
    };

    const getOById = (os_Id) => {
        const o = os.find(o => o.os_Id === os_Id);
        return o ? o.os_TenO : "Unknown O";
    };

    return (
        <div className={cx('wrapper')}>
            <h1 className='text-align-center'>Thông Tin Phiếu Mượn</h1>
            <div className="row m-5 ">
                <div className="col-12 d-flex justify-content-center mt-5">
                    <div className="col-4 d-flex align-items-center justify-content-center m-5">
                        <form className='w-100 fs-2 text-start' onSubmit={handleSubmit}>
                            <div className="mb-3 text-start">
                                <label htmlFor="exampleInputEmail1" className="form-label">Ngày mượn</label>
                                <input type="date" className="form-control fs-2" id="exampleInputEmail1" value={ngayMuon} readOnly />
                            </div>
                            <div className="mb-3 text-start">
                                <label htmlFor="exampleInputEmail2" className="form-label">Hạn trả</label>
                                <input type="date" className="form-control fs-2" id="exampleInputEmail2" value={ngayHanTra} onChange={(e) => setNgayHanTra(e.target.value)} />
                            </div>
                            <div className="mb-3 text-start">
                                <label id="exampleInputEmail3" className="form-label">Số lượng</label>
                                <input type="number" className="form-control fs-2" id="exampleInputEmail3" value={soLuongNhap} onChange={(e) => setSoLuongNhap(parseInt(e.target.value))} />
                                {!isValidSoLuong() && <span style={{ color: 'red' }}>Số lượng không hợp lệ</span>}
                            </div>
                            <button type="submit" className="btn btn-primary fs-2 p-3" disabled={!isValidSoLuong()}>SUBMIT</button>
                        </form>
                    </div>
                    <div className="col-6 d-flex align-items-center justify-content-center">
                        <div className='d-flex flex-column mb-3'>
                            <div className='text-start'>
                                <h1>Sinh viên:</h1>
                                {user && (
                                    <>
                                        <h3>
                                            <span className='fw-bold'>Họ tên: </span>
                                            {user.nd_HoTen}
                                        </h3>
                                        <h3>
                                            <span className='fw-bold'>MSSV: </span>
                                            {user.nd_Username}
                                        </h3>
                                    </>
                                )}
                            </div>

                            <div className='text-start mt-5'>
                                <h1>Thông tin sách:</h1>
                                {sach && (
                                    <>
                                        <h3>
                                            <span className='fw-bold'>Tên sách: </span>
                                            {sach.s_TenSach}
                                        </h3>

                                        <h3 className='mt-3'>
                                            <span className='fw-bold '>Tác giả: </span>
                                            {getAuthorNameById(sach.tg_Id)}
                                        </h3 >

                                        <h3 className='mt-3'>
                                            <span className='fw-bold'>Nhà xuất bản: </span>
                                            {getNXBNameById(sach.nxb_Id)}
                                        </h3>

                                        <h3 className='mt-3'>
                                            <span className='fw-bold'>Năm xuất bản: </span>
                                            {new Date(sach.s_NamXuatBan).toLocaleDateString('en-GB')}
                                        </h3>

                                        <h3 className='mt-3'>
                                            <span className='fw-bold'>Vị trí sách : </span>
                                            {getKeById(sach.ks_Id)} - {getOById(sach.os_Id)}
                                        </h3>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PhieuMuonUser;
