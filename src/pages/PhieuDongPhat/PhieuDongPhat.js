import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import classNames from "classnames/bind";
import styles from "./PhieuDongPhat.module.scss";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const cx = classNames.bind(styles);

const showToastMessage = (message, type) => {
    if (type === "success") {
        toast.success(message);
    } else if (type === "error") {
        toast.error(message);
    }
};

function PhieuDongPhat() {
    const [phieuQuaHan, setPhieuQuaHan] = useState([]);
    const [chiTietPhieuPhat, setChiTietPhieuPhat] = useState(null);
    const [selectedPhieu, setSelectedPhieu] = useState(null);
    const [toastMessage, setToastMessage] = useState("");
    const PhotoPath = "https://localhost:44315/Photos/";

    const [nguoiDungs, setNguoiDungs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const itemsPerPage = 7; // Số lượng mục mỗi trang

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch("https://localhost:44315/api/NguoiDung");
                if (!response.ok) throw new Error("Lỗi khi lấy dữ liệu người dùng.");
                const data = await response.json();
                setNguoiDungs(data);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu người dùng:", error);
            }
        };

        fetchUsers();
    }, []);


    useEffect(() => {
        const fetchOverdueLoans = async () => {
            try {
                const response = await fetch("https://localhost:44315/api/QuanLyPhieuMuon/ListPM");
                if (!response.ok) throw new Error("Lỗi khi lấy dữ liệu phiếu mượn.");
                const data = await response.json();

                // Filter only overdue records
                const overdueLoans = data.filter(
                    (pm) =>
                        pm.NgayTra && // Ensure Ngày trả is not null
                        new Date(pm.NgayTra) > new Date(pm.HanTra) && // Ngày trả is after Hạn trả
                        pm.TrangThaiMuon === "Đã trả" // Ensure the loan is marked as "Đã trả"
                );

                setPhieuQuaHan(overdueLoans);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu:", error);
            }
        };

        fetchOverdueLoans();
    }, []);


    const handleCreateFine = async (pmId) => {
        try {
            const response = await fetch(`https://localhost:44315/api/PhieuDongPhat?pm_Id=${pmId}`, {
                method: "POST",
            });
            if (!response.ok) throw new Error("Không thể tạo phiếu đóng phạt.");
            const data = await response.json();

            setPhieuQuaHan((prevList) =>
                prevList.map((item) =>
                    item.Id_PhieuMuon === pmId ? { ...item, PmDaXuatPhat: true } : item
                )
            );

            setChiTietPhieuPhat(data);
            showToastMessage("Phiếu đóng phạt đã được tạo thành công!", "success");
        } catch (error) {
            console.error("Lỗi khi tạo phiếu đóng phạt:", error);
            showToastMessage("Không thể tạo phiếu đóng phạt.", "error");
        }
    };

    const exportToPDF = () => {
        if (chiTietPhieuPhat) {
            const doc = new jsPDF();
            doc.text("PHIẾU ĐÓNG PHẠT", 14, 10);
            doc.autoTable({
                head: [["Số phiếu", "Tổng tiền phạt (VNĐ)", "Ngày phạt", "Trạng thái"]],
                body: [
                    [
                        chiTietPhieuPhat.PdpId,
                        chiTietPhieuPhat.PdpTongTienPhat,
                        new Date(chiTietPhieuPhat.PdpNgayDong).toLocaleDateString("vi-VN"),
                        chiTietPhieuPhat.PdpTrangThaiDong ? "Đã thanh toán" : "Chưa thanh toán",
                    ],
                ],
            });
            doc.save("PhieuDongPhat.pdf");
        }
    };

    const handleShowDetails = (phieu) => {
        setSelectedPhieu(phieu);
    };

    const handleCloseModal = () => {
        setSelectedPhieu(null);
    };

    const totalPages = Math.ceil(phieuQuaHan.length / itemsPerPage);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = phieuQuaHan.slice(indexOfFirstItem, indexOfLastItem);

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handleGoToPage = (page) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    return (
        <div className={cx("wrapper")}>
            <h1 className={cx("text-center fw-bold mb-5")}>Quản lý phiếu mượn quá hạn</h1>
            <ToastContainer />
            <div className={cx("table-responsive")}>
                <table className={cx("table", "table-bordered")}>
                    <thead>
                        <tr>
                            <th>Mã phiếu</th>
                            <th>Người mượn</th>
                            <th>Hạn trả</th>
                            <th>Ngày trả</th>
                            <th>Số ngày quá hạn</th>
                            <th>Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((phieu) => {
                            const user = nguoiDungs.find((user) => user.nd_Id === phieu.Id_User);

                            return (
                                <tr key={phieu.Id_PhieuMuon}>
                                    <td>{phieu.Id_PhieuMuon}</td>
                                    <td>{user ? user.nd_HoTen : "Không rõ"}</td>
                                    <td>{new Date(phieu.HanTra).toLocaleDateString("vi-VN")}</td>
                                    <td>{new Date(phieu.NgayTra).toLocaleDateString("vi-VN")}</td>
                                    <td>
                                        {(() => {
                                            const hanTra = new Date(phieu.HanTra);
                                            const ngayTra = new Date(phieu.NgayTra);

                                            // Set time components to midnight to ignore hours, minutes, and seconds
                                            hanTra.setHours(0, 0, 0, 0);
                                            ngayTra.setHours(0, 0, 0, 0);

                                            // Calculate overdue days
                                            const overdueDays = Math.floor((ngayTra - hanTra) / (1000 * 60 * 60 * 24));
                                            return `${overdueDays} ngày`;
                                        })()}
                                    </td>

                                    <td>
                                        {phieu.PmDaXuatPhat === false ? (
                                            <>
                                                <button
                                                    className={cx("btn", "btn-primary", "me-4", "fs-4")}
                                                    onClick={() => handleShowDetails(phieu)}
                                                >
                                                    Hiển thị chi tiết
                                                </button>
                                                <button
                                                    className={cx("btn", "btn-warning", "fs-4")}
                                                    onClick={() => handleCreateFine(phieu.Id_PhieuMuon)}
                                                >
                                                    Xuất phiếu đóng phạt
                                                </button>
                                            </>
                                        ) : (
                                            <div className={cx("d-flex", "justify-content-center")}>
                                                <button
                                                    className={cx("btn", "btn-primary", "me-4", "fs-4")}
                                                    onClick={() => handleShowDetails(phieu)}
                                                >
                                                    Hiển thị chi tiết
                                                </button>
                                                <button
                                                    className={cx("btn", "btn-danger", "fs-4", "me-4")}
                                                    disabled
                                                >
                                                    Đã xuất PDP
                                                </button>


                                            </div>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <div className={cx("pagination-container")}>
                <button
                    className={cx("pagination-btn", "prev-btn")}
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                >
                    &laquo;
                </button>
                {[...Array(totalPages)].map((_, index) => (
                    <button
                        key={index + 1}
                        className={cx(
                            "pagination-btn",
                            { "active-btn": currentPage === index + 1 }
                        )}
                        onClick={() => handleGoToPage(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
                <button
                    className={cx("pagination-btn", "next-btn")}
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                >
                    &raquo;
                </button>
            </div>


            {/* Modal hiển thị thông tin chi tiết */}
            {selectedPhieu && (
                <div className={cx("modal-overlay")}>
                    <div className={cx("modal-content", "text-start")}>
                        <h2>Chi tiết phiếu mượn #{selectedPhieu.Id_PhieuMuon}</h2>
                        <p>Người mượn: {selectedPhieu.Id_User}</p>
                        <p>Ngày mượn: {new Date(selectedPhieu.NgayMuon).toLocaleDateString("vi-VN")}</p>
                        <p>Hạn trả: {new Date(selectedPhieu.HanTra).toLocaleDateString("vi-VN")}</p>
                        <p>Ngày trả:   {new Date(selectedPhieu.NgayTra).toLocaleDateString("vi-VN")}</p>
                        <p>Số lượng sách: {selectedPhieu.ChiTiet.length}</p>
                        <ul>
                            <h3>Bao gồm sách:</h3>
                            {selectedPhieu.ChiTiet.map((sach, index) => (
                                <li key={index}>{sach.TenSach} - Số lượng: {sach.SoLuongSach}</li>
                            ))}
                        </ul>
                        <button className="btn btn-secondary mt-3 fs-3" onClick={handleCloseModal}>
                            Đóng
                        </button>
                    </div>
                </div>

            )}
        </div>

    );
}

export default PhieuDongPhat;
