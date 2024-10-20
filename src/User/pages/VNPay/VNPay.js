import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './VNPay.module.scss';
import { useLocation, Link } from 'react-router-dom';

const cx = classNames.bind(styles);

const VNPay = () => {
    const location = useLocation(); // Sử dụng hook useLocation để lấy URL params
    const [success, setSuccess] = useState(null);
    const [transactionId, setTransactionId] = useState('');
    const [orderId, setOrderId] = useState('');

    const [orderType, setOrderType] = useState('electric');
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [orderDescription, setOrderDescription] = useState('');

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search); // Lấy các tham số từ URL
        const success = searchParams.get('success') === 'True';
        const transactionId = searchParams.get('transactionId');
        const orderId = searchParams.get('orderId');

        setSuccess(success);
        setTransactionId(transactionId);
        setOrderId(orderId);
    }, [location.search]); // Theo dõi sự thay đổi của location.search

    const handleSubmit = async (e) => {
        e.preventDefault();

        const paymentData = {
            orderType,
            name,
            amount: parseFloat(amount),
            orderDescription
        };

        try {
            const response = await fetch('http://localhost:5000/api/vnpay/CreatePaymentUrl', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(paymentData)
            });

            const data = await response.json();

            if (data.paymentUrl) {
                // Chuyển hướng đến trang thanh toán VNPAY
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
        <div className={cx('vnpay-result')}>
            <h2>Kết quả giao dịch VNPay</h2>
            {success === null ? (
                <div>
                    <p>Điền thông tin thanh toán</p>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="ordertype">Loại hàng hóa</label>
                            <select
                                id="ordertype"
                                name="ordertype"
                                value={orderType}
                                onChange={(e) => setOrderType(e.target.value)}
                                required
                            >
                                <option value="electric">Đồ điện tử</option>
                                <option value="fashion">Thời trang</option>
                                <option value="other">Khác</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="name">Tên khách hàng</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="amount">Số tiền (VNĐ)</label>
                            <input
                                type="number"
                                id="amount"
                                name="amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="orderDescription">Nội dung thanh toán</label>
                            <textarea
                                id="orderDescription"
                                name="orderDescription"
                                rows="3"
                                value={orderDescription}
                                onChange={(e) => setOrderDescription(e.target.value)}
                                required
                            ></textarea>
                        </div>

                        <button type="submit">Thanh toán (Checkout)</button>
                    </form>
                </div>
            ) : success ? (
                <div>
                    <p>Giao dịch thành công!</p>
                    <p>Mã giao dịch: {transactionId}</p>
                    <p>Mã đơn hàng: {orderId}</p>
                    <Link to="/">Quay lại trang chủ</Link>
                </div>
            ) : (
                <div>
                    <p>Giao dịch thất bại!</p>
                    <Link to="/">Quay lại trang chủ</Link>
                </div>
            )}
        </div>
    );
};

export default VNPay;
