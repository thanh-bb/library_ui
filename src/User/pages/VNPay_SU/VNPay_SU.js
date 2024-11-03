import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './VNPay_SU.module.scss';
import { Link, useLocation } from 'react-router-dom';

const cx = classNames.bind(styles);

const VNPay_SU = () => {
    const location = useLocation();
    const [success, setSuccess] = useState(null);
    const [nddkId, setNddkId] = useState('');
    const [amount, setAmount] = useState(0);

    // Hàm cập nhật trạng thái thanh toán
    const updatePaymentStatus = async (nddkId, status, amount) => {
        try {
            const response = await fetch(`https://localhost:44315/api/NguoiDungDangKy/UpdateTrangThaiThanhToan`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nddkId: nddkId,
                    nddkTrangThaiThanhToan: status,
                    nddkSoTien: amount
                })
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Cập nhật trạng thái thành công:", data);
                localStorage.removeItem("nddk_Id");  // Chỉ xóa khi cập nhật thành công
            } else {
                console.error("Lỗi khi cập nhật trạng thái thanh toán.");
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái thanh toán:", error);
        }
    };

    useEffect(() => {
        // Lấy các tham số từ URL
        const searchParams = new URLSearchParams(location.search);
        const isSuccess = searchParams.get('success') === 'True';
        setSuccess(isSuccess);

        // Lấy pmo_Id từ localStorage
        const nddkIdFromStorage = localStorage.getItem("nddk_Id");
        setNddkId(nddkIdFromStorage);

        // Lấy số tiền từ tham số URL (giả định rằng bạn đã thêm nó vào URL)
        const amountFromUrl = searchParams.get('amount');
        setAmount(amountFromUrl ? parseFloat(amountFromUrl) : 0); // Chuyển đổi thành số nếu có


        if (nddkIdFromStorage) {
            const status = isSuccess ? "Thanh toán thành công" : "Thanh toán không thành công";

            // Gọi API để cập nhật trạng thái thanh toán
            updatePaymentStatus(nddkIdFromStorage, status, amountFromUrl ? parseFloat(amountFromUrl) : 0);


        }
    }, [location.search]);

    return (
        <div className={cx('vnpay-result', 'container')}>
            <h2 className={cx('title', 'text-center', 'mt-5')}>Kết quả giao dịch VNPay</h2>

            {success === null ? (
                <p>Đang kiểm tra kết quả...</p>
            ) : success ? (
                <div className="text-center">
                    <p className="text-success">Giao dịch thành công!</p>
                    <p className="text-success">
                        Thanh toán thành công số tiền: <span className='fw-bold'>{new Intl.NumberFormat('vi-VN').format(amount)} VND</span>
                    </p>
                    <p>Mã đăng ký: {nddkId}</p>
                    <Link to="/userhome" className={cx('btn-payment')}>
                        Quay lại
                    </Link>
                </div>
            ) : (
                <div className="text-center">
                    <p className="text-danger">Giao dịch thất bại!</p>
                    <Link to="/userhome" className={cx('btn-payment', 'mt-3')}>
                        Quay lại
                    </Link>
                </div>
            )}
        </div>
    );
};

export default VNPay_SU;
