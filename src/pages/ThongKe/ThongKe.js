import React, { useState } from "react";
import { Bar, Line } from 'react-chartjs-2';
import axios from 'axios';
import classNames from 'classnames/bind';
import styles from './ThongKe.module.scss';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Đăng ký các thành phần cần thiết
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
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
    const [mode, setMode] = useState('ngay'); // 'ngay', '7ngay', 'thang'
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1); // Tháng hiện tại

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
        // setSachNoiBat([]);
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

    const fetchThongKeTheoThang = () => {
        setMode('thang');
        setErrorMessage('');
        axios.get(`https://localhost:44315/api/ThongKe/ThongKeMuonSachTheoThangChiTiet?month=${month}&year=${year}`)
            .then(response => {
                setSachNoiBat(response.data);
                if (response.data.length > 0) {
                    setMoTaThoiGian(`Số lần mượn sách trong tháng ${month}/${year}`);
                } else {
                    setMoTaThoiGian(`Không có dữ liệu cho tháng ${month}/${year}.`);
                }
            })
            .catch(error => {
                console.error('Error fetching book statistics data:', error);
                setErrorMessage('Có lỗi xảy ra khi tải dữ liệu.');
            });
    };

    const fetchThongKeTheoQuy = () => {
        setMode('quy');
        setErrorMessage('');
        axios.get(`https://localhost:44315/api/ThongKe/ThongKeMuonSachTheoQuy?year=${year}`)
            .then(response => {
                setSachNoiBat(response.data);
                if (response.data.length > 0) {
                    setMoTaThoiGian(`Số lần mượn sách theo quý trong năm ${year}`);
                } else {
                    setMoTaThoiGian(`Không có dữ liệu cho năm ${year}.`);
                }
            })
            .catch(error => {
                console.error('Error fetching book statistics data:', error);
                setErrorMessage('Có lỗi xảy ra khi tải dữ liệu.');
            });
    };


    const bookData = {
        labels: sachNoiBat.map(book => mode === 'thang' ? book.STenSach : book.STenSach),
        datasets: [
            {
                label: mode === 'ngay'
                    ? `Số lần mượn từ ${formatDate(startDate)} đến ${formatDate(endDate)}`
                    : mode === '7ngay'
                        ? `Số lần mượn trong 7 ngày qua`
                        : `Số lần mượn trong tháng ${month}/${year}`,
                data: sachNoiBat.map(book => book.TongSoLanMuon),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };



    const bookData_Q = {
        labels: ['Quý 1', 'Quý 2', 'Quý 3', 'Quý 4'],
        datasets: [
            {
                label: `Số lần mượn sách theo quý trong năm ${year}`,
                data: [0, 0, 0, 0], // Giá trị mặc định cho các quý
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.4)',
                borderWidth: 2,
                fill: true,
            },
        ],
    };

    // Cập nhật dữ liệu từ API vào biểu đồ
    sachNoiBat.forEach(book => {
        if (book.MoTaThoiGian.includes('Quý 1')) {
            bookData_Q.datasets[0].data[0] += book.TongSoLanMuon;
        } else if (book.MoTaThoiGian.includes('Quý 2')) {
            bookData_Q.datasets[0].data[1] += book.TongSoLanMuon;
        } else if (book.MoTaThoiGian.includes('Quý 3')) {
            bookData_Q.datasets[0].data[2] += book.TongSoLanMuon;
        } else if (book.MoTaThoiGian.includes('Quý 4')) {
            bookData_Q.datasets[0].data[3] += book.TongSoLanMuon;
        }
    });


    const handleModeChange = (newMode) => {
        setMode(newMode);
        if (newMode === 'ngay' || newMode === 'thang' || newMode === 'quy') {
            setSachNoiBat([]);
            setMoTaThoiGian("");
        }
    };

    const handleYearChange = (e) => {
        setYear(e.target.value);
        setSachNoiBat([]); // Reset dữ liệu khi năm thay đổi
        setMoTaThoiGian("");
    };

    return (
        <div className={cx('wrapper')}>
            <h2 className={cx('header')}>Thống Kê Mượn Sách</h2>
            <div className={cx('navigation')}>
                <button onClick={() => handleModeChange('ngay')}>Thống kê theo ngày</button>
                <button onClick={fetchThongKe7Ngay}>Thống kê trong 7 ngày vừa qua</button>
                <button onClick={() => handleModeChange('thang')}>Thống kê theo tháng</button>
                <button onClick={() => handleModeChange('quy')}>Thống kê theo quý</button>
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
                                <button className={cx('fetch-button', 'inline-button')} onClick={fetchThongKe}>Thống Kê</button>
                            </div>
                        </div>
                        <p>{moTaThoiGian}</p>
                    </div>
                )}
                {mode === 'thang' && (
                    <div className={cx('filters', 'inline-filters', 'month-filter-container')}>
                        <div className={cx('navigation')}>
                            <div className={cx('filter-item')}>
                                <label htmlFor="year">Chọn năm: </label>
                                <select
                                    id="year"
                                    value={year}
                                    onChange={(e) => setYear(e.target.value)}
                                    className={cx('select w-100')}
                                >
                                    {Array.from({ length: 5 }, (_, i) => {
                                        const currentYear = new Date().getFullYear();
                                        const yearOption = currentYear - i;
                                        return (
                                            <option key={yearOption} value={yearOption}>{`Năm ${yearOption}`}</option>
                                        );
                                    })}
                                </select>
                            </div>
                            <div className={cx('filter-item')}>
                                <label htmlFor="month">Chọn tháng: </label>
                                <select
                                    id="month"
                                    value={month}
                                    onChange={(e) => setMonth(e.target.value)}
                                    className={cx('select w-100')}
                                >
                                    {Array.from({ length: 12 }, (_, i) => (
                                        <option key={i + 1} value={i + 1}>{`Tháng ${i + 1}`}</option>
                                    ))}
                                </select>
                            </div>
                            <div className={cx('filter-item', 'button-container')}>
                                <button className={cx('fetch-button', 'inline-button')} onClick={fetchThongKeTheoThang}>
                                    Thống Kê Theo Tháng
                                </button>
                            </div>
                        </div>
                        <p className={cx('description')}>{moTaThoiGian}</p>
                    </div>
                )}
                {mode === '7ngay' && (
                    <p>{moTaThoiGian}</p>
                )}
                {mode === 'quy' && (
                    <div className={cx('filters', 'inline-filters', 'month-filter-container')}>
                        <div className={cx('navigation')}>
                            <div className={cx('filter-item')}>
                                <label htmlFor="year">Chọn năm: </label>
                                <select
                                    id="year"
                                    value={year}
                                    onChange={handleYearChange}
                                    className={cx('select w-100')}
                                >
                                    {Array.from({ length: 5 }, (_, i) => {
                                        const currentYear = new Date().getFullYear();
                                        const yearOption = currentYear - i;
                                        return (
                                            <option key={yearOption} value={yearOption}>{`Năm ${yearOption}`}</option>
                                        );
                                    })}
                                </select>
                            </div>

                            <div className={cx('filter-item', 'button-container')}>
                                <button className={cx('fetch-button', 'inline-button')} onClick={fetchThongKeTheoQuy}>Thống Kê</button>
                            </div>
                        </div>
                        <p>{moTaThoiGian}</p>
                    </div>
                )}

                {/* Hiển thị mô tả thời gian */}
                {mode !== 'quy' && (

                    <div>
                        < div className={cx('chart-container')}>
                            {sachNoiBat.length > 0 && !errorMessage ? (
                                <Bar data={bookData} options={{ responsive: true, maintainAspectRatio: false }} />
                            ) : (
                                <p></p>
                            )}
                        </div>

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
                )}

                {mode === 'quy' && (
                    <div>
                        <div className={cx('chart-container')}>
                            {sachNoiBat.length > 0 && !errorMessage ? (
                                <Line data={bookData_Q} options={{ responsive: true, maintainAspectRatio: false }} />
                            ) : (
                                <p>Không có dữ liệu</p>
                            )}
                        </div>

                        {/* Thêm thông tin tóm tắt chỉ cho 4 quý */}
                        <div className={cx('summary')}>
                            <h3>Thông tin chi tiết</h3>
                            {sachNoiBat.map((book, index) => (
                                <div key={index} className={cx('book-details')}>
                                    <p>Quý: {book.MoTaThoiGian.split(' ')[1] || `Quý ${index + 1}`}</p>
                                    <p>Tên sách: {book.STenSach}</p>
                                    <p>Số lần mượn: {book.TongSoLanMuon}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}



                {/* Thêm thông tin tóm tắt */}




            </div>
        </div >
    );
};

export default ThongKe;
