import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './VNPay.module.scss';
import { Link, useLocation } from 'react-router-dom';

const cx = classNames.bind(styles);

const VNPay = () => {
    const location = useLocation();
    const [success, setSuccess] = useState(null);
    const [pmoId, setPmoId] = useState('');

    // Hàm cập nhật trạng thái thanh toán
    const updatePaymentStatus = async (pmoId, status) => {
        try {
            const response = await fetch(`https://localhost:44315/api/CTPMOnline/TrangThaiThanhToan`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    pmoId: pmoId,
                    ttTrangThai: status
                })
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Cập nhật trạng thái thành công:", data);
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
        const pmoIdFromStorage = localStorage.getItem("pmo_Id");
        setPmoId(pmoIdFromStorage);

        if (pmoIdFromStorage) {
            const status = isSuccess ? "Thanh toán thành công" : "Thanh toán không thành công";

            // Gọi API để cập nhật trạng thái thanh toán
            updatePaymentStatus(pmoIdFromStorage, status);

            // Xóa pmo_Id khỏi localStorage sau khi sử dụng
            localStorage.removeItem("pmo_Id");
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
                    <p>Mã phiếu mượn online: {pmoId}</p>
                    <Link to="/userhome" className={cx('btn-payment')}>
                        Quay lại trang chủ
                    </Link>
                </div>
            ) : (
                <div className="text-center">
                    <p className="text-danger">Giao dịch thất bại!</p>
                    <Link to="/userhome" className={cx('btn-payment', 'mt-3')}>
                        Quay lại trang chủ
                    </Link>
                </div>
            )}
        </div>
    );
};

export default VNPay;
