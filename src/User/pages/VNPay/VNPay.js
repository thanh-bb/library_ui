import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './VNPay.module.scss';
import { Link, useLocation } from 'react-router-dom';

const cx = classNames.bind(styles);

const VNPay_PDP = () => {
    const location = useLocation();
    const [success, setSuccess] = useState(null);
    const [pdpId, setPdpId] = useState('');
    const [amount, setAmount] = useState(0);

    const updatePaymentStatus = async (pdpId, status, amount) => {
        try {
            const response = await fetch(`https://localhost:44315/api/PhieuDongPhat/UpdateTrangThaiThanhToan`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    pdpId: pdpId,
                    pdpTrangThaiDong: status,
                    pdpTongTienPhat: amount
                })
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Cập nhật trạng thái thành công:", data);
                localStorage.removeItem("pdp_Id"); // Only remove if successful
            } else {
                console.error("Lỗi khi cập nhật trạng thái thanh toán.");
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái thanh toán:", error);
        }
    };

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const isSuccess = searchParams.get('success') === 'True';
        setSuccess(isSuccess);

        const pdpIdFromStorage = localStorage.getItem("pdp_Id");
        setPdpId(pdpIdFromStorage);

        const amountFromUrl = searchParams.get('amount');
        setAmount(amountFromUrl ? parseFloat(amountFromUrl) : 0);

        if (pdpIdFromStorage) {
            const status = isSuccess ? true : false;
            updatePaymentStatus(pdpIdFromStorage, status, amountFromUrl ? parseFloat(amountFromUrl) : 0);
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
                        Thanh toán thành công số tiền: <span className="fw-bold">{new Intl.NumberFormat('vi-VN').format(amount)} VND</span>
                    </p>
                    <p>Mã phiếu đóng phạt: {pdpId}</p>
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

export default VNPay_PDP;
