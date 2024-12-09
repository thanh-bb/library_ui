import React, { Component } from "react";
import classNames from 'classnames/bind';
import styles from './QuanLyPhieuMuonOnline.module.scss';
import { Link } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const cx = classNames.bind(styles);

function calculateWorkingHours(ngayMuon, hoursToAdd = 48) {
    const ngayMuonDate = new Date(ngayMuon);
    let remainingHours = hoursToAdd;
    let currentDate = new Date(ngayMuonDate);

    while (remainingHours > 0) {
        // Chuyển đến giờ tiếp theo
        currentDate.setHours(currentDate.getHours() + 1);

        // Kiểm tra xem có phải cuối tuần không
        const day = currentDate.getDay();
        if (day !== 6 && day !== 0) { // Bỏ qua Thứ 7 (6) và Chủ Nhật (0)
            remainingHours--;
        }
    }

    return currentDate; // Trả về thời gian kết thúc sau khi tính đủ 48 giờ làm việc
}
function calculateRemainingTime(ngayMuon) {
    const hanTraDate = calculateWorkingHours(ngayMuon, 48); // Tính `HanTra` 48 giờ bỏ qua cuối tuần
    const now = new Date();
    const distance = hanTraDate - now;

    if (distance <= 0) return 0;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24)); // Tính số ngày còn lại
    const totalHours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); // Tính số giờ còn lại
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)); // Tính số phút còn lại
    const seconds = Math.floor((distance % (1000 * 60)) / 1000); // Tính số giây còn lại

    return `${String(days).padStart(2)}ngày ${String(totalHours).padStart(2, '0')}h:${String(minutes).padStart(2, '0')}m:${String(seconds).padStart(2, '0')}s`;
}


export class QuanLyPhieuMuonOnline extends Component {
    constructor(props) {
        super(props);

        this.state = {
            chitietpms: [],
            tenSachFilter: '',
            tensachWithoutFilter: [],// Khởi tạo mảng chitietpmsWithoutFilter
            selectedTag: "Đang mượn",
            phieumuonWithoutFilter: [],
            phieumuons: [],
            TrangThaiMuon: "",
            TrangThaiXetDuyet: "",
            idPhieuMuonFilter: '',

            currentPage: 1,
            itemsPerPage: 5,
            totalPages: 0,
        }
    }

    handleIdPhieuMuonFilterChange = (e) => {
        this.setState({ idPhieuMuonFilter: e.target.value });
    }


    handleTenSachFilterChange = (e) => {
        this.setState({ tenSachFilter: e.target.value });
    }

    sortResult(prop, asc) {
        var sortedData = this.state.phieumuons.sort(function (a, b) {
            if (asc) {
                return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
            }
            else {
                return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
            }
        });

        this.setState({ chitietpms: sortedData });
    }

    refreshList() {
        const token = sessionStorage.getItem('jwttoken');
        if (token) {
            const decodedToken = jwtDecode(token);
            const nd_id = decodedToken.nameid;

            fetch(`https://localhost:44315/api/QuanLyPhieuMuon/${nd_id}`)
                .then(response => response.json())
                .then(data => {

                    this.setState({
                        chitietpms: data.filter(pm => pm.TrangThaiMuon === this.state.selectedTag || pm.TrangThaiXetDuyet === this.state.selectedTag),
                        tensachWithoutFilter: data, // Lưu toàn bộ dữ liệu phiếu mượn
                        phieumuons: data
                    }, () => {
                        // Lọc danh sách dựa trên trạng thái đã chọn


                        this.FilterFn();
                    });

                })
                .catch(error => {
                    console.error('Error fetching data: ', error);
                });
        } else {
            console.error('Access token not found');
        }
    }


    componentDidMount() {
        this.refreshList();
        this.interval = setInterval(() => {
            this.forceUpdate(); // Cập nhật lại giao diện mỗi giây để hiển thị đếm ngược
            this.checkOverdue(); // Gọi hàm checkOverdue định kỳ
        }, 1000); // Cập nhật mỗi giây
    }


    componentWillUnmount() {
        clearInterval(this.interval);
    }


    checkOverdue() {
        const { phieumuons } = this.state;
        phieumuons.forEach(order => {
            if (order.TrangThaiMuon === "Đang giữ sách") {
                const remainingHours = calculateRemainingTime(order.NgayMuon);

                if (remainingHours <= 0) {
                    // Cập nhật trạng thái phiếu mượn khi quá hạn
                    axios.put(`https://localhost:44315/api/CTPMOnline/CapNhatTrangThaiQuaHan`)
                        .then(response => {
                            console.log(`Trạng thái phiếu mượn ID ${order.Id_PhieuMuon} đã được cập nhật.`);
                            this.refreshList(); // Làm mới danh sách để hiển thị trạng thái cập nhật
                        })
                        .catch(error => {
                            console.error("Không thể cập nhật trạng thái phiếu mượn:", error);
                        });
                }
            }
        });
    }


    FilterFn() {
        const { selectedTag, tensachWithoutFilter } = this.state;
        console.log(selectedTag)
        // Lọc dựa trên selectedTag
        const filteredData = tensachWithoutFilter.filter(el => {
            return (el.TrangThaiMuon === selectedTag || el.TrangThaiXetDuyet === selectedTag) &&
                el.PmLoaiMuon === "Đặt online"
        });

        console.log("Dữ liệu sau khi lọc:", filteredData); // Kiểm tra dữ liệu sau khi lọc
        this.setState({ phieumuons: filteredData });
    }




    // Phân loại trạng thái
    handleTagSelection = (tag) => {
        this.setState({ selectedTag: tag }, () => {
            this.FilterFn();
        });
    }

    // Chuyển trang trước
    prevPage = () => {
        this.setState((prevState) => ({
            currentPage: prevState.currentPage > 1 ? prevState.currentPage - 1 : 1
        }));
    }

    // Chuyển sang trang kế tiếp
    nextPage = () => {
        const { currentPage, phieumuons, itemsPerPage } = this.state;
        const totalPages = Math.ceil(phieumuons.length / itemsPerPage);
        this.setState({
            currentPage: currentPage < totalPages ? currentPage + 1 : currentPage
        });
    }


    // Chuyển đến trang cụ thể
    goToPage = (pageNumber) => {
        this.setState({ currentPage: pageNumber });
    }



    render() {

        const { phieumuons, tenSachFilter, idPhieuMuonFilter } = this.state;

        // const filteredChitietpms = chitietpms.filter(pm =>
        //     pm.TenSach.toLowerCase().includes(tenSachFilter.toLowerCase())
        // );

        const filteredPhieumuons = phieumuons.filter(pm =>
            pm.Id_PhieuMuon.toString().includes(idPhieuMuonFilter)
        );

        const { selectedTag } = this.state;

        const { currentPage, itemsPerPage } = this.state;
        const totalPages = Math.ceil(phieumuons.length / itemsPerPage);
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentItems = phieumuons.slice(indexOfFirstItem, indexOfLastItem);



        return (
            <div className={cx('wrapper')}>
                <div className="row d-flex justify-content-end mb-3">
                    <h1 className="fw-bold mt-5 mb-5 ">Phiếu Mượn Online Tại Thư Viện</h1>
                    <hr></hr>
                    <div className="col-2">
                        <button
                            type="button"
                            className={cx('btn-status', { 'btn-selected': selectedTag === "Đang giữ sách" })}
                            onClick={() => this.handleTagSelection("Đang giữ sách")}

                        >
                            Đang giữ sách
                        </button>
                    </div>
                    <div className="col-2">
                        <button
                            type="button"
                            className={cx('btn-status', { 'btn-selected': selectedTag === "Quá hạn nhận sách" })}
                            onClick={() => this.handleTagSelection("Quá hạn nhận sách")}
                        >
                            Quá hạn nhận sách
                        </button>
                    </div>
                    <div className="col-2">
                        <button
                            type="button"
                            className={cx('btn-status', { 'btn-selected': selectedTag === "Ðang mượn" })}
                            onClick={() => this.handleTagSelection("Ðang mượn")}
                        >
                            Ðang mượn
                        </button>
                    </div>
                    <div className="col-2">
                        <button
                            type="button"
                            className={cx('btn-status', { 'btn-selected': selectedTag === "Đã trả" })}
                            onClick={() => this.handleTagSelection("Đã trả")}
                        >
                            Đã trả
                        </button>
                    </div>
                </div>

                <div className="row mb-4 shadow-sm p-3 mb-5 bg-body-tertiary rounded">
                    <div className="d-flex flex-row w-100 mb-2">
                        <input
                            className="form-control m-2 fs-3 p-2 w-100"
                            type="text"
                            placeholder="Tìm kiếm theo ID phiếu mượn"
                            value={idPhieuMuonFilter}
                            onChange={this.handleIdPhieuMuonFilterChange}
                        />
                        <button type="button" className="btn btn-light"
                            onClick={() => this.sortResult('Id_PhieuMuon', true)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-down-square-fill" viewBox="0 0 16 16">
                                <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5a.5.5 0 0 1 1 0z" />
                            </svg>
                        </button>

                        <button type="button" className="btn btn-light"
                            onClick={() => this.sortResult('Id_PhieuMuon', false)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-up-square-fill" viewBox="0 0 16 16">
                                <path d="M2 16a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2zm6.5-4.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 1 0z" />
                            </svg>
                        </button>
                    </div>
                </div>
                <table className="table table-hover shadow p-3 mb-5 bg-body-tertiary rounded w-5">
                    <thead >
                        <tr>
                            <th className="text-start">ID Phiếu</th>

                            <th className="text-center ">Ngày Mượn</th>
                            <th className="text-center ">Hạn Trả</th>
                            {(selectedTag === "Đang giữ sách") && (
                                <th className="text-center">
                                    Thời gian giữ sách còn lại
                                </th>)}
                            <th className="text-center">Trạng Thái</th>
                            <th className="text-center">Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map(dep =>
                            <tr key={dep.Id_PhieuMuon}>
                                <td className="text-start">{dep.Id_PhieuMuon}</td>
                                <td className="text-center">{new Date(dep.NgayMuon).toLocaleDateString('en-GB')}</td>
                                <td className="text-center">{new Date(dep.HanTra).toLocaleDateString('en-GB')}</td>

                                {selectedTag === "Đang giữ sách" && (
                                    <td>
                                        {calculateRemainingTime(dep.NgayMuon)}
                                    </td>
                                )}

                                <td className="text-center">
                                    {dep.TrangThaiMuon === "Đã trả" ? (
                                        (new Date(dep.HanTra) - new Date()) < 0 ?
                                            `Đã trả - Trễ hạn ${Math.abs(Math.floor((new Date(dep.HanTra) - new Date()) / (1000 * 60 * 60 * 24)))} ngày` :
                                            "Đã trả - Đúng hạn"
                                    ) : dep.TrangThaiMuon === "Ðang mượn" ? (
                                        (new Date(dep.HanTra) - new Date()) < 0 ?
                                            `${Math.floor((new Date() - new Date(dep.HanTra)) / (1000 * 60 * 60 * 24))} ngày (Quá hạn)` :
                                            `Đang mượn - Còn ${Math.floor((new Date(dep.HanTra) - new Date()) / (1000 * 60 * 60 * 24))} ngày đến hạn`
                                    ) : dep.TrangThaiMuon === "Đang giữ sách" ? (
                                        "Đang giữ sách"
                                    ) : dep.TrangThaiMuon === "Quá hạn nhận sách" ? (
                                        "Quá hạn nhận sách"

                                    ) : ("")}
                                </td>


                                <td className="text-center">
                                    <Link type="button" to={`/chitietphieutra/${dep.Id_PhieuMuon}`} className={`btn btn-link fs-4`}>Xem chi tiết</Link>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Điều hướng phân trang */}
                <div className={cx('pagination-item')}>
                    <nav aria-label="Page navigation example">
                        <ul className={cx('pagination')}>
                            {/* Previous Button */}
                            <li className={cx('page-item', { disabled: currentPage === 1 })}>
                                <a className={cx('page-link')} href="#" aria-label="Previous" onClick={(e) => { e.preventDefault(); this.prevPage(); }}>
                                    <span aria-hidden="true">&laquo;</span>
                                </a>
                            </li>

                            {/* Page Numbers */}
                            {[...Array(totalPages)].map((_, i) => (
                                <li key={i + 1} className={cx('page-item', { active: currentPage === i + 1 })}>
                                    <a
                                        className={cx('page-link')}
                                        href="#"
                                        onClick={(e) => { e.preventDefault(); this.goToPage(i + 1); }}
                                    >
                                        {i + 1}
                                    </a>
                                </li>
                            ))}

                            {/* Next Button */}
                            <li className={cx('page-item', { disabled: currentPage === totalPages })}>
                                <a className={cx('page-link')} href="#" aria-label="Next" onClick={(e) => { e.preventDefault(); this.nextPage(); }}>
                                    <span aria-hidden="true">&raquo;</span>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>

            </div>
        )
    }
}
