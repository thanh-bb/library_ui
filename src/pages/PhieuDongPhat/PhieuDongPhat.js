import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import classNames from 'classnames/bind';
import styles from './PhieuDongPhat.module.scss';
import { Link } from 'react-router-dom';



function PhieuDongPhat() {
    const [pmId, setPmId] = useState('');
    const [message, setMessage] = useState('');
    const [pdp, setPDP] = useState(null);
    const [nguoiMuon, setNguoiMuon] = useState(null); // Thông tin người mượn
    const cx = classNames.bind(styles);

    useEffect(() => {
        const fetchNguoiMuon = async (pmId) => {
            try {
                const response = await fetch(`https://localhost:44315/api/NguoiDung/FindByPmId/${pmId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch user information');
                }
                const userData = await response.json();
                setNguoiMuon(userData[0]);
            } catch (error) {
                console.error('Error fetching user information:', error);
            }
        };

        if (pdp && pdp.PmId) {
            fetchNguoiMuon(pdp.PmId);
        }
    }, [pdp]);
    console.log(nguoiMuon)
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`https://localhost:44315/api/PhieuDongPhat?pm_Id=${pmId}`, {
                method: 'POST'
            });
            if (!response.ok) {
                throw new Error('Failed to create PhieuDongPhat');
            }
            const data = await response.json();
            setMessage("Đã tạo phiếu đóng phạt thành công");
            setPDP(data);

        } catch (error) {
            setMessage('Đã xảy ra lỗi khi tạo phiếu đóng phạt.');
            console.error('Error:', error);
        }
    };

    const exportToPDF = () => {
        if (pdp && nguoiMuon) {
            const doc = new jsPDF();
            // Tạo dữ liệu bảng từ pdp
            const tableData = [];
            tableData.push([
                'So Phieu Dong Phat',
                'Tong Tien Phat (VND)',
                'Ngay Dong',
                'Trang Thai Dong',
                'So Phieu Muon',
                // 'Nguoi Muon'
            ]);
            tableData.push([
                pdp.PdpId,
                pdp.PdpTongTienPhat,
                new Date(pdp.PdpNgayDong).toLocaleDateString('en-GB'),
                pdp.PdpTrangThaiDong ? 'Da thanh toan' : 'Chua thanh toan',
                pdp.PmId,
                // nguoiMuon.nd_HoTen
            ]);

            // Xuất PDF từ dữ liệu bảng
            doc.autoTable({
                head: tableData.slice(0, 1), // Header của bảng
                body: tableData.slice(1)     // Dữ liệu bảng
            });

            // Thêm tiêu đề và chữ ký dưới bảng
            doc.text('PHIEU DONG PHAT', 14, 10);

            // Đặt người đóng phạt sang bên phải
            const yPosition = doc.internal.pageSize.height - 240; // Lấy vị trí y hiện tại của chữ ký
            const xPosition = doc.internal.pageSize.width - 100; // Đặt người đóng phạt sang bên phải
            doc.text('Nguoi Dong Phat (Ky Ten)', xPosition, yPosition);

            // Lưu file PDF
            doc.save('PhieuDongPhat.pdf');
        }
    };


    return (
        <div className={cx('wrapper')}>
            <div className="container text-center ">
                <h1 className='fs-1 fw-bold '>Phiếu Đóng Phạt</h1>
                <form onSubmit={handleSubmit}>
                    <div className="row d-flex justify-content-around mt-5">
                        <div className="col d-flex justify-content-center mt-5 offset-1 ">
                            <div className='fw-bold fs-2 row mt-4'>
                                <div className='col d-flex justify-content-end'> Mã Phiếu Mượn:</div>
                                <div className='col '>
                                    <input
                                        type="text"
                                        value={pmId}
                                        className="form-control fs-2 "
                                        onChange={(e) => setPmId(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col d-flex mt-5 ">
                            <button type="submit" className={cx('btn-grad')}>Tạo Phiếu Đóng Phạt</button>
                            <button type="button" className={cx('btn-grad')} onClick={exportToPDF}>Xuất file PDF</button>
                            <Link to="/admin/phieudongphat/quanly" type="button" className={cx('btn-grad')} >Xem phiếu đóng phạt</Link>
                        </div>
                    </div>
                </form>
                {message && (
                    <div>
                        <p className="bg-success-subtle fs-1 text-success mt-4">{message} </p>
                        {pdp && (
                            <div>
                                <h2 className='mt-5 fw-bold fs-1'>Chi tiết phiếu đóng phạt</h2>
                                <div className='container w-50 mt-3'>
                                    {nguoiMuon && (
                                        <p className='fs-2'><strong>Tên người đóng phạt:</strong> {nguoiMuon.nd_HoTen}</p>
                                    )}
                                    <table className="table">
                                        <tbody>
                                            <tr className='text-start'>
                                                <th scope="row">Số phiếu:</th>
                                                <td > {pdp.PdpId}</td>
                                            </tr>
                                            <tr className='text-start'>
                                                <th scope="row">Tổng tiền phạt:</th>
                                                <td >{pdp.PdpTongTienPhat} VND</td>
                                            </tr>
                                            <tr className='text-start'>
                                                <th scope="row">Ngày đóng:</th>
                                                <td >
                                                    {new Date(pdp.PdpNgayDong).toLocaleDateString('en-GB')}
                                                </td>
                                            </tr >
                                            <tr className='text-start'>
                                                <th scope="row">Trạng thái đóng:</th>
                                                <td >{pdp.PdpTrangThaiDong
                                                    ? 'Đã thanh toán' : 'Chưa thanh toán'}</td>
                                            </tr>
                                            <tr className='text-start'>
                                                <th scope="row">Phiếu mượn:</th>
                                                <td >{pdp.PmId}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}

export default PhieuDongPhat;
