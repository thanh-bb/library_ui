import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './ChiTietNDDK.module.scss';


const cx = classNames.bind(styles);
const prices = {
    "6 tháng": 60000,
    "1 năm": 120000,
    "2 năm": 240000
};

function generateUsername(name) {
    // Tách tên cuối cùng từ họ tên đầy đủ (ví dụ: "Trần Thị Thanh Thanh" -> "Thanh")
    const nameParts = name.trim().split(" ");
    const lastName = nameParts[nameParts.length - 1].toLowerCase();

    // Tạo 6 số ngẫu nhiên
    const randomNumbers = Math.floor(100000 + Math.random() * 900000);

    // Kết hợp phần tên cuối cùng và 6 số ngẫu nhiên
    return `${lastName}${randomNumbers}`;
}

async function isUsernameAvailable(username) {
    const response = await fetch(`https://localhost:44315/api/NguoiDung/CheckUsernameAvailability?username=${username}`);
    const isAvailable = await response.json();
    return isAvailable;
}

function generatePassword() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters[randomIndex];
    }
    return password;
}


function ChiTietNDDK() {
    let { id } = useParams();
    const [NDDK, setNDDK] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentStep, setCurrentStep] = useState(1); // Manage current step
    const [nddk_TrangThaiThanhToan, setNddk_TrangThaiThanhToan] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        const fetchNDDK = async () => {
            try {
                const response = await fetch(`https://localhost:44315/api/NguoiDungDangKy/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setNDDK(data[0]);
                    setLoading(false);
                } else {
                    throw new Error('Failed to fetch data');
                }
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };
        fetchNDDK();

    }, [id]);

    useEffect(() => {
        const generateUniqueUsername = async () => {
            if (NDDK) {
                let newUsername;
                do {
                    newUsername = generateUsername(NDDK.nddk_HoTen);
                } while (!(await isUsernameAvailable(newUsername))); // Lặp lại cho đến khi tìm được username khả dụng
                setUsername(newUsername);
            }
        };
        if (currentStep === 2 && NDDK) {
            generateUniqueUsername();
            setPassword(generatePassword());
        }
    }, [currentStep, NDDK]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('https://localhost:44315/api/NguoiDung', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ndUsername: username,
                    ndCccd: NDDK.nddk_CCCD,
                    ndSoDienThoai: NDDK.nddk_SoDienThoai,
                    ndHinhThe: NDDK.nddk_HinhThe,
                    ndPassword: password,
                    ndHoTen: NDDK.nddk_HoTen,
                    ndNgaySinh: NDDK.nddk_NgaySinh,
                    ndGioiTinh: NDDK.nddk_GioiTinh,
                    ndEmail: NDDK.nddk_Email,
                    ndDiaChi: NDDK.nddk_DiaChi,
                    ndNgayDangKy: NDDK.nddk_NgayDangKy,
                    ndThoiGianSuDung: NDDK.nddk_ThoiGianSuDung,
                    ndActive: true,
                    qId: "2",
                    lndLoaiNguoiDung: 2,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to submit data');
            }
            // Show success notification

            const userId = await response.json();

            // Send the welcome email
            const emailResponse = await fetch(`https://localhost:44315/api/Mail/SendWelcomeEmail?userId=${userId}`, {
                method: 'POST',
            });

            if (!emailResponse.ok) {
                throw new Error('Failed to send welcome email');
            }

            const responseUpdate = await fetch('https://localhost:44315/api/NguoiDungDangKy', {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nddkId: NDDK.nddk_Id,
                    nddkTrangThaiDuyet: "Đã xét duyệt",
                }),
            });
            if (!responseUpdate.ok) {
                throw new Error('Failed to update data');
            }

            const defaultAddress = await fetch('https://localhost:44315/api/DiaChiGiaoHang', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ndId: userId,
                    dcghTenNguoiNhan: NDDK.nddk_HoTen,
                    dcghSoDienThoai: NDDK.nddk_SoDienThoai,
                    dcghDiaChi: NDDK.nddk_DiaChi,
                }),
            });
            if (!defaultAddress.ok) {
                throw new Error('Failed to create data');
            }


            alert('Xét duyệt và cấp tài khoản thành công');
            window.location.href = '/admin/nguoidungdangky';

        } catch (error) {
            console.error('Error submitting data or sending email:', error);
        }

    };


    const changes_TrangThaiThanhToan = (e) => {
        setNddk_TrangThaiThanhToan(e.target.value);
    };

    const nextStep = () => {
        // Perform validation here if needed
        setCurrentStep(prevStep => prevStep + 1);
    };

    const prevStep = () => {
        setCurrentStep(prevStep => prevStep - 1);
    };

    const calculateTotalPrice = () => {
        const { nddk_ThoiGianSuDung } = this.state;
        const price = prices[nddk_ThoiGianSuDung];
        return price ? `${price.toLocaleString('vi-VN')} đ` : '0 đ';
    };

    return (
        <div className={cx("wrapper")}>

            <div className={cx("container")}>

                <div className={cx('content-body')} >
                    <div className="card border border-0">
                        <div >
                            <h2 className={cx('card-header')}>Thông tin người dùng đăng ký</h2>
                        </div>
                        <hr />


                        {NDDK && (
                            <>
                                {currentStep === 1 && (
                                    <div>
                                        <div className="row d-flex justify-content-between">
                                            <div className='col-1'>
                                                <img
                                                    width="120px"
                                                    height="180px"
                                                    style={{ borderRadius: "10px" }}
                                                    alt=""
                                                    src={
                                                        NDDK?.nddk_HinhThe
                                                            ? `https://localhost:44315/Photos/${NDDK?.nddk_HinhThe}`
                                                            : "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"
                                                    }
                                                />
                                            </div>
                                            <div className="col-4 ">
                                                <div className="form-group mb-3">
                                                    <label className="fw-medium">Họ tên</label>
                                                    : {NDDK?.nddk_HoTen}
                                                </div>

                                                <div className="form-group mb-3">
                                                    <label className="fw-medium">Ngày sinh</label>
                                                    : {new Date(NDDK?.nddk_NgaySinh).toLocaleDateString('en-GB')}
                                                </div>

                                                <div className="form-group mb-3">
                                                    <label className="fw-medium">Giới tính</label>
                                                    : {NDDK?.nddk_GioiTinh}
                                                </div>

                                                <div className="form-group mb-3">
                                                    <label className="fw-medium">Số CCCD</label>
                                                    : {NDDK?.nddk_CCCD}
                                                </div>

                                                <div className="form-group mb-3">
                                                    <label className="fw-medium">Số điện thoại</label>
                                                    : {NDDK?.nddk_SoDienThoai}
                                                </div>

                                                <div className="form-group mb-3">
                                                    <label className="fw-medium">Địa chỉ</label>
                                                    : {NDDK?.nddk_DiaChi}
                                                </div>

                                            </div>

                                            <div className="col-5">

                                                <div className="form-group mb-3">
                                                    <label className="fw-medium">Email</label>
                                                    : {NDDK?.nddk_Email}
                                                </div>

                                                <div className="form-group mb-3">
                                                    <label className="fw-medium">Ngày đăng ký</label>
                                                    : {new Date(NDDK?.nddk_NgayDangKy).toLocaleDateString('en-GB')}
                                                </div>

                                                <div className="form-group mb-3">
                                                    <label className="fw-medium">Thời gian sử dụng</label>
                                                    : {NDDK?.nddk_ThoiGianSuDung}
                                                </div>

                                                <div className="form-group mb-3">
                                                    <label className="fw-medium">Hình thức trả phí</label>
                                                    : {NDDK?.nddk_HinhThucTraPhi}
                                                </div>

                                                <div className="form-group mb-3">
                                                    <label className="fw-medium">Trạng thái thanh toán</label>
                                                    : {NDDK?.nddk_TrangThaiThanhToan}

                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                                        <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                                                    </svg>

                                                </div>

                                            </div>
                                        </div>

                                        <div className="row d-flex justify-content-between mt-3">
                                            <div className='col-4'>
                                                <img
                                                    width="300px"
                                                    height="200px"
                                                    style={{ borderRadius: "10px" }}
                                                    alt=""
                                                    src={
                                                        NDDK?.nddk_CCCD_MatTruoc
                                                            ? `https://localhost:44315/Photos/${NDDK?.nddk_CCCD_MatTruoc}`
                                                            : "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"
                                                    }
                                                />
                                            </div>
                                            <div className='col-4'>
                                                <img
                                                    width="300px"
                                                    height="200px"
                                                    style={{ borderRadius: "10px" }}
                                                    alt=""
                                                    src={
                                                        NDDK?.nddk_CCCD_MatSau
                                                            ? `https://localhost:44315/Photos/${NDDK?.nddk_CCCD_MatSau}`
                                                            : "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"
                                                    }
                                                />
                                            </div>
                                            <div className='col-4 mt-auto'>
                                                <div className="row flex">
                                                    <div className="col-5">
                                                        <Link to="/admin/nguoidungdangky" type="submit" className={cx('btn-return')}>
                                                            <p className="pt-2">Quay lại</p>
                                                        </Link>
                                                    </div>
                                                    <div className="col-7 ">
                                                        <button
                                                            type="button"
                                                            className={cx('btn-continue')}
                                                            onClick={nextStep}
                                                        >   Đồng ý xét duyệt
                                                        </button>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}


                        {NDDK && (
                            <>
                                {currentStep === 2 && (
                                    <div>
                                        <div className="row d-flex justify-content-around">
                                            <div className="col-4 mt-5">

                                                <div className="form-group mb-3">
                                                    <label className="fw-bold fs-2">Username</label>
                                                    : {username}
                                                </div>

                                                <div className="form-group mb-3">
                                                    <label className="fw-bold fs-2">Password</label>
                                                    : {password}
                                                </div>

                                            </div>

                                            <div className="col-5">
                                                <div className="form-group mb-3">
                                                    <label className="fw-medium">Họ tên</label>
                                                    : {NDDK?.nddk_HoTen}
                                                </div>

                                                <div className="form-group mb-3">
                                                    <label className="fw-medium">Ngày sinh</label>
                                                    : {new Date(NDDK?.nddk_NgaySinh).toLocaleDateString('en-GB')}
                                                </div>

                                                <div className="form-group mb-3">
                                                    <label className="fw-medium">Giới tính</label>
                                                    : {NDDK?.nddk_GioiTinh}
                                                </div>

                                                <div className="form-group mb-3">
                                                    <label className="fw-medium">Số CCCD</label>
                                                    : {NDDK?.nddk_CCCD}
                                                </div>

                                                <div className="form-group mb-3">
                                                    <label className="fw-medium">Số điện thoại</label>
                                                    : {NDDK?.nddk_SoDienThoai}
                                                </div>

                                                <div className="form-group mb-3">
                                                    <label className="fw-medium">Địa chỉ</label>
                                                    : {NDDK?.nddk_DiaChi}
                                                </div>

                                                <div className="form-group mb-3">
                                                    <label className="fw-medium">Email</label>
                                                    : {NDDK?.nddk_Email}
                                                </div>

                                                <div className="form-group mb-3">
                                                    <label className="fw-medium">Ngày đăng ký</label>
                                                    : {new Date(NDDK?.nddk_NgayDangKy).toLocaleDateString('en-GB')}
                                                </div>

                                                <div className="form-group mb-3">
                                                    <label className="fw-medium">Thời gian sử dụng</label>
                                                    : {NDDK?.nddk_ThoiGianSuDung}
                                                </div>

                                                <div className="row flex">
                                                    <div className="col-5">
                                                        <button type="button" className={cx('btn-return')} onClick={prevStep}>
                                                            <p className="pt-2">Quay lại</p>
                                                        </button>
                                                    </div>
                                                    <div className="col-7 ">
                                                        <button
                                                            type="button"
                                                            className={cx('btn-continue')}
                                                            onClick={handleSubmit}
                                                        >   Tạo tài khoản và gửi mail
                                                        </button>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>


                                    </div>
                                )}
                            </>
                        )}


                    </div>
                </div>
            </div>
        </div>
    );
}
export default ChiTietNDDK;
