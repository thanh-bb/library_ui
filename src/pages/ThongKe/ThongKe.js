import React, { useState, useEffect } from "react";
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import classNames from 'classnames/bind';
import styles from './ThongKe.module.scss';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Đăng ký các thành phần cần thiết
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const cx = classNames.bind(styles);

const ThongKe = () => {
    const [sachNoiBat, setSachNoiBat] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [moTaThoiGian, setMoTaThoiGian] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [mode, setMode] = useState('ngay'); // 'ngay' cho thống kê theo ngày, '7ngay' cho thống kê 7 ngày qua

    const formatDate = (date) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(date).toLocaleDateString('vi-VN', options);
    };

    const fetchThongKe = () => {
        if (new Date(startDate) > new Date(endDate)) {
            setErrorMessage("Ngày bắt đầu không được lớn hơn ngày kết thúc.");
            setSachNoiBat([]); // Ẩn biểu đồ khi có lỗi
            return;
        }

        setErrorMessage('');
        if (startDate && endDate) {
            axios.get(`https://localhost:44315/api/ThongKe/ThongKeMuonSachTheoNgay?startDate=${startDate}&endDate=${endDate}`)
                .then(response => {
                    setSachNoiBat(response.data);
                    if (response.data.length > 0) {
                        setMoTaThoiGian(response.data[0].MoTaThoiGian);
                    } else {
                        setMoTaThoiGian(`Không có dữ liệu từ ${formatDate(startDate)} đến ${formatDate(endDate)}`);
                    }
                })
                .catch(error => {
                    console.error('Error fetching book statistics data:', error);
                    setErrorMessage('Có lỗi xảy ra khi tải dữ liệu.');
                });
        }
    };

    const fetchThongKe7Ngay = () => {
        setMode('7ngay');
        setErrorMessage('');
        axios.get(`https://localhost:44315/api/ThongKe/ThongKeMuonSach7NgayQua`)
            .then(response => {
                setSachNoiBat(response.data);
                if (response.data.length > 0) {
                    setMoTaThoiGian(response.data[0].MoTaThoiGian);
                } else {
                    setMoTaThoiGian(`Không có dữ liệu trong 7 ngày qua.`);
                }
            })
            .catch(error => {
                console.error('Error fetching book statistics data:', error);
                setErrorMessage('Có lỗi xảy ra khi tải dữ liệu.');
            });
    };

    const bookData = {
        labels: sachNoiBat.map(book => book.STenSach),
        datasets: [
            {
                label: mode === 'ngay'
                    ? `Số lần mượn từ ${formatDate(startDate)} đến ${formatDate(endDate)}`
                    : `Số lần mượn trong 7 ngày qua`,
                data: sachNoiBat.map(book => book.TongSoLanMuon),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const handleModeChange = (newMode) => {
        setMode(newMode);
        if (newMode === 'ngay') {
            setSachNoiBat([]); // Tạm ẩn biểu đồ khi chuyển về thống kê theo ngày
            setMoTaThoiGian("")
        }
    };

    return (
        <div className={cx('wrapper')}>
            <h2 className={cx('header')}>Thống Kê Mượn Sách</h2>
            <div className={cx('navigation')}>
                <button onClick={() => handleModeChange('ngay')}>Thống kê theo ngày</button>
                <button onClick={fetchThongKe7Ngay}>Thống kê trong 7 ngày vừa qua</button>
            </div>
            <div className={cx('statistics-container')}>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

                {mode === 'ngay' && (
                    <div className={cx('filters', 'inline-filters')}>
                        <div className={cx('navigation')}>
                            <div className={cx('date-picker', 'inline-input')}>
                                <label htmlFor="start-date">Chọn ngày bắt đầu: </label>
                                <input type="date" id="start-date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                            </div>
                            <div className={cx('date-picker', 'inline-input')}>
                                <label htmlFor="end-date">Chọn ngày kết thúc: </label>
                                <input type="date" id="end-date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                            </div>
                            <div className={cx('fetch-button-1')}>
                                <button className={cx('fetch-button', 'inline-button',)} onClick={fetchThongKe}>Thống Kê</button>

                            </div>
                        </div>
                        <p>{moTaThoiGian}</p>
                    </div>

                )}
                {mode === '7ngay' && (
                    <p>{moTaThoiGian}</p>
                )}

                {/* Hiển thị mô tả thời gian */}
                <div className={cx('chart-container')}>
                    {sachNoiBat.length > 0 && !errorMessage ? (
                        <Bar data={bookData} options={{ responsive: true, maintainAspectRatio: false }} />
                    ) : (
                        <p></p>
                    )}
                </div>

                {/* Thêm thông tin tóm tắt */}
                <div className={cx('summary')}>
                    <h3>Thông tin chi tiết</h3>
                    {sachNoiBat.map(book => (
                        <div key={book.SId} className={cx('book-details')}>
                            <p>Tên sách: {book.STenSach}</p>
                            <p>Số lần mượn: {book.TongSoLanMuon}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ThongKe;
