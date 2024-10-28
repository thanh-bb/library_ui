import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './VNPay.module.scss';
import { useLocation, Link } from 'react-router-dom';

const cx = classNames.bind(styles);

const VNPay = () => {
    const location = useLocation();
    const [success, setSuccess] = useState(null);
    const [transactionId, setTransactionId] = useState('');
    const [orderId, setOrderId] = useState('');
    const [orderType, setOrderType] = useState('electric');
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [orderDescription, setOrderDescription] = useState('');

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const success = searchParams.get('success') === 'True';
        const transactionId = searchParams.get('transactionId');
        const orderId = searchParams.get('orderId');

        setSuccess(success);
        setTransactionId(transactionId);
        setOrderId(orderId);
    }, [location.search]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const paymentData = {
            orderType,
            name,
            amount: parseFloat(amount),
            orderDescription,
        };

        try {
            const response = await fetch('http://localhost:5000/api/vnpay/CreatePaymentUrl', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(paymentData),
            });

            const data = await response.json();

            if (data.paymentUrl) {
                window.location.href = data.paymentUrl;
            } else {
                alert('Có lỗi xảy ra khi tạo URL thanh toán.');
            }
        } catch (error) {
            console.error('Lỗi khi tạo thanh toán:', error);
            alert('Có lỗi xảy ra trong quá trình tạo thanh toán.');
        }
    };

    return (
        <div className={cx('vnpay-result', 'container')}>
            <h2 className={cx('title', 'text-center', 'mt-5')}>Kết quả giao dịch VNPay</h2>

            {success === null ? (
                <div className={cx('payment-form', 'card', 'shadow', 'p-4', 'mt-4')}>
                    <p className="text-center">Điền thông tin thanh toán</p>
                    <form onSubmit={handleSubmit} className="form-container">
                        <div className={cx('form-group', 'mb-3')}>
                            <label htmlFor="ordertype">Loại hàng hóa</label>
                            <select
                                id="ordertype"
                                name="ordertype"
                                className="form-control"
                                value={orderType}
                                onChange={(e) => setOrderType(e.target.value)}
                                required
                            >
                                <option value="electric">Đồ điện tử</option>
                                <option value="fashion">Thời trang</option>
                                <option value="other">Khác</option>
                            </select>
                        </div>

                        <div className={cx('form-group', 'mb-3')}>
                            <label htmlFor="name">Tên khách hàng</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className="form-control"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className={cx('form-group', 'mb-3')}>
                            <label htmlFor="amount">Số tiền (VNĐ)</label>
                            <input
                                type="number"
                                id="amount"
                                name="amount"
                                className="form-control"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                            />
                        </div>

                        <div className={cx('form-group', 'mb-3')}>
                            <label htmlFor="orderDescription">Nội dung thanh toán</label>
                            <textarea
                                id="orderDescription"
                                name="orderDescription"
                                className="form-control"
                                rows="3"
                                value={orderDescription}
                                onChange={(e) => setOrderDescription(e.target.value)}
                                required
                            ></textarea>
                        </div>

                        <div className="text-center">
                            <button type="submit" className={cx('btn', 'btn-primary', 'btn-lg', 'fw-bold')}>
                                Thanh toán (Checkout)
                            </button>
                        </div>
                    </form>
                </div>
            ) : success ? (
                <div className="text-center">
                    <p className="text-success">Giao dịch thành công!</p>
                    <p>Mã giao dịch: {transactionId}</p>
                    <p>Mã đơn hàng: {orderId}</p>
                    <Link to="/userhome" className={cx('btn-payment')}>
                        Quay lại trang chủ
                    </Link>
                </div>
            ) : (
                <div className="text-center">
                    <p className="text-danger">Giao dịch thất bại!</p>
                    <Link to="/userhome" className={cx('btn-payment mt-3 ')}>
                        Quay lại trang chủ
                    </Link>
                </div>
            )}
        </div>
    );
};

export default VNPay;
