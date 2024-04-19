import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './ChiTietSach.module.scss';
import { jwtDecode } from 'jwt-decode';

const cx = classNames.bind(styles);

function ChiTietSach() {
    let { id } = useParams(); // Lấy id sách từ URL
    let jwttoken = sessionStorage.getItem('jwttoken');

    const [userActive, setUserActive] = useState(false);

    const [sach, setSach] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tacgias, setTacgias] = useState([]);
    const [nxbs, setNxbs] = useState([]);
    const [kes, setKes] = useState([]);
    const [os, setOs] = useState([]);

    useEffect(() => {
        const decodedToken = jwtDecode(jwttoken);
        const userId = decodedToken.nameid;

        const fetchUser = async () => {

            try {
                // Gửi yêu cầu để lấy trạng thái của NguoiDung từ nd_Id lấy từ token
                const response = await fetch(`https://localhost:44315/api/NguoiDung/${userId}`);
                if (response.ok) {
                    const userData = await response.json();
                    setUserActive(userData[0]);
                    setLoading(false);
                } else {
                    throw new Error('Failed to fetch user data');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }

        };

        const fetchSach = async () => {
            try {
                const response = await fetch(`https://localhost:44315/api/Sach/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setSach(data[0]); // Dữ liệu trả về là một mảng, chọn phần tử đầu tiên
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

        fetchUser();
        fetchSach();
        fetchTacGia();
        fetchNXB();
        fetchKe();
        fetchO();
    }, [id]);

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
            <div className="row m-5 ">
                {!userActive.nd_active && (
                    <button type="button" className="btn btn-danger fs-3 mb-4">Tài khoản của bạn đã bị khóa do vi phạm quy định của thư viện nên tạm thời bạn không thể mượn sách</button>
                )}

                <div className="col-12 d-flex justify-content-center mt-5">
                    <div className="col-4 d-flex align-items-center justify-content-center m-5">
                        <img
                            src={`https://localhost:44315/Photos/${sach?.s_HinhAnh}`}
                            alt={sach?.s_TenSach}
                            width="200px"
                            height="300px"
                        />
                    </div>
                    <div className="col-6 d-flex align-items-center justify-content-center">

                        <div className='text-start'>
                            {sach && (
                                <>
                                    <h3>
                                        <span className='fw-bold'>Tên sách: </span>
                                        {sach?.s_TenSach}
                                    </h3>

                                    <h3 className='mt-3'>
                                        <span className='fw-bold '>Tác giả: </span>
                                        {getAuthorNameById(sach?.tg_Id)}
                                    </h3 >

                                    <h3 className='mt-3'>
                                        <span className='fw-bold'>Nhà xuất bản: </span>
                                        {getNXBNameById(sach?.nxb_Id)}
                                    </h3>

                                    <h3 className='mt-3'>
                                        <span className='fw-bold'>Năm xuất bản: </span>
                                        {new Date(sach?.s_NamXuatBan).toLocaleDateString('en-GB')}
                                    </h3>

                                    <h3 className='mt-3'>
                                        <span className='fw-bold'>Mô tả: </span>
                                        {sach?.s_MoTa}
                                    </h3>

                                    <h3 className='mt-3'>
                                        <span className='fw-bold'>Số lượng sách còn lại: </span>
                                        {sach?.s_SoLuong}
                                    </h3>

                                    <h3 className='mt-3'>
                                        <span className='fw-bold'>Vị trí sách : </span>
                                        {getKeById(sach?.ks_Id)} - {getOById(sach?.os_Id)}
                                    </h3>

                                    <h3 className='mt-3'>
                                        <span className='fw-bold'>Trạng thái sách: </span>
                                        <span className='text-success'>{sach?.s_TrangThaiMuon === true ? " Trong kho sẵn sàng" : sach?.s_TrangThaiMuon === false ? "Chưa sẵn sàng" : "Trạng thái không xác định"}</span>
                                    </h3>

                                    <h3 className='mt-3'>
                                        <span className='fw-bold text-danger'>Lưu ý: </span>
                                        <span className='text-primary'>{sach?.s_ChiDoc === true ? "Chỉ được đọc tại thư viện" : sach?.s_ChiDoc === false ? "Được mượn về nhà" : "Trạng thái không xác định"}</span>
                                    </h3>

                                    {/* Hiển thị nút "Tiến hành mượn sách" nếu người dùng active */}
                                    {userActive.nd_active && (
                                        <Link type="button" to={`/chitietsach/formphieumuon/${sach?.s_Id}`} className={`btn btn-success fs-3 mt-5 p-3 ${sach?.s_TrangThaiMuon === true && sach?.s_ChiDoc === false ? '' : 'disabled'}`}>Tiến hành mượn sách</Link>
                                    )}

                                </>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}


export default ChiTietSach;
