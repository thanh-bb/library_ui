import React, { Component } from "react";
import classNames from 'classnames/bind';
import styles from './PhieuMuon.module.scss';
import axios from 'axios';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);
const trangThaiMuonMapping = {
    1: "Đang mượn",
    2: "Đã trả",
    3: "Đang giữ sách",
    4: "Quá hạn nhận sách"
};


export class PhieuMuon extends Component {
    constructor(props) {
        super(props);

        this.state = {
            phieumuons: [],
            nguoidungs: [],
            phieutras: [],
            modalTitle: "",
            pm_NgayMuon: "",
            pm_HanTra: "",
            pm_Id: 0,

            pm_HanTraFilter: "",
            pm_NgayMuonFilter: "",
            phieumuonsWithoutFilter: [],


            selectedTag: "Chờ xét duyệt",
            phieumuonWithoutFilter: [],
            TrangThaiMuon: "",
            TrangThaiXetDuyet: "",

            currentPage: 1,
            itemsPerPage: 8,
            totalPages: 0,

            selectedPhieuMuon: null,
        }
    }
    FilterFn() {
        const { selectedTag, phieumuonsWithoutFilter } = this.state;

        const filteredData = phieumuonsWithoutFilter.filter((el) => {
            // Normalize and convert both values to lowercase
            const normalizedTrangThaiMuon = el.TrangThaiMuon.normalize("NFC").toLowerCase();
            const normalizedSelectedTag = selectedTag.normalize("NFC").toLowerCase();

            return (
                (el.TrangThaiMuon === selectedTag || el.TrangThaiXetDuyet === selectedTag) &&
                el.PmLoaiMuon === "Mượn trực tiếp"
            );
        });

        this.setState({ phieumuons: filteredData });
    }


    sortResult(prop, asc) {
        const sortedData = [...this.state.phieumuons].sort((a, b) => {
            if (asc) {
                return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
            } else {
                return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
            }
        });

        this.setState({ phieumuons: sortedData, currentPage: 1 });
    }



    changepm_NgayMuonFilter = (e) => {
        this.setState({ pm_NgayMuonFilter: e.target.value }, () => {
            this.FilterFn();
        });
    }

    changepm_HanTraFilter = (e) => {
        this.setState({ pm_HanTraFilter: e.target.value }, () => {
            this.FilterFn();
        });
    }

    refreshList() {
        fetch("https://localhost:44315/api/QuanLyPhieuMuon/ListPM")
            .then(response => response.json())
            .then(data => {
                const totalPages = Math.ceil(data.length / this.state.itemsPerPage);

                // Lọc ra chỉ các phiếu mượn có trạng thái "Đang mượn"
                const filteredData = data.filter(pm =>
                    (pm.TrangThaiMuon === this.state.selectedTag || pm.TrangThaiXetDuyet === this.state.selectedTag) &&
                    pm.PmLoaiMuon === "Mượn trực tiếp"
                );
                // Sắp xếp dữ liệu theo ngày mượn giảm dần
                filteredData.sort((a, b) => new Date(b.NgayMuon) - new Date(a.NgayMuon));

                this.setState({
                    phieumuons: filteredData,
                    phieumuonsWithoutFilter: data, // Update phieumuonsWithoutFilter with fetched data
                    totalPages: totalPages
                });
            })
            .catch(error => {
                console.error('Error fetching data: ', error);
            });

        // Fetch dữ liệu người dùng và phiếu trả như trước
        fetch("https://localhost:44315/api/NguoiDung")
            .then(response => response.json())
            .then(data => {
                this.setState({ nguoidungs: data });
            });

        fetch(`https://localhost:44315/api/QuanLyPhieuTra`)
            .then(response => response.json())
            .then(data => {
                this.setState({ phieutras: data });
            });
    }

    componentDidMount() {
        this.refreshList();
    }

    changepm_TrangThai = (e) => {
        this.setState({ ttm_Id: e.target.value });
    }

    changepm_TrangThaiXetDuyet = (e) => {
        this.setState({ pm_TrangThaiXetDuyet: e.target.value });
    }

    editClick(dep) {
        this.setState({
            modalTitle: "Chỉnh sửa trạng thái phiếu mượn",
            pm_Id: dep.Id_PhieuMuon,
            ttm_Id: dep.ttm_Id,  // Sử dụng ttm_Id thay vì pm_TrangThaiMuon
            nd_Id: dep.Id_User
        });
    }


    updateClick() {
        fetch("https://localhost:44315/api/PhieuMuon", {
            method: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                pmId: this.state.pm_Id,
                ttmId: this.state.ttm_Id
            })
        })
            .then(res => res.json())
            .then((result) => {
                alert(result);
                this.refreshList();
            }, (error) => {
                alert('Failed');
            });


        const nd_Id = this.state.nd_Id;
        const pm_Id = this.state.pm_Id; // Get the pm_Id from the state

        // Fetch ChiTietPhieuMuon data for the specific pm_Id
        fetch(`https://localhost:44315/api/ChiTietPhieuMuon/${pm_Id}`, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then((data) => {
                // Check if data is not empty
                if (data && data.length > 0) {
                    // Lấy thông tin cần thiết từ phản hồi
                    const s_Id = data[0].s_Id;
                    const ctpt_SoLuongSachTra = data[0].ctpm_SoLuongSachMuon;



                    // Sau khi lấy thông tin, gửi yêu cầu POST để tạo phiếu trả
                    fetch("https://localhost:44315/api/PhieuTra", {
                        method: "POST",
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            ptNgayTra: new Date(),
                            ndId: nd_Id,
                            pmId: pm_Id,
                            chiTietPhieuTras: [
                                {
                                    sId: s_Id,
                                    ctptSoLuongSachTra: ctpt_SoLuongSachTra
                                }
                            ]
                        })
                    })
                        .then(res => res.json())
                        .then((result) => {
                            //   alert(result);
                            this.refreshList(); // Sau khi thêm thành công, làm mới danh sách
                        })
                        .catch((error) => {
                            console.error('Failed to create PhieuTra: ', error);
                            alert('Failed to create PhieuTra');
                        });
                } else {
                    alert("No ChiTietPhieuMuon data found for the provided pm_Id");
                }
            })
            .catch((error) => {
                console.error('Failed to fetch ChiTietPhieuMuon data: ', error);
                alert('Failed to fetch ChiTietPhieuMuon data');
            });

    }

    updateXetDuyetClick() {
        fetch("https://localhost:44315/api/PhieuMuon/XetDuyet", {
            method: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                pmId: this.state.pm_Id,
                pmTrangThaiXetDuyet: this.state.pm_TrangThaiXetDuyet
            })
        })
            .then(res => res.json())
            .then((result) => {
                alert(result);
                this.refreshList();
            }, (error) => {
                alert('Failed');
            });

    }


    deleteClick(id) {
        if (window.confirm("Ban co chac chan muon xoa?")) {
            fetch("https://localhost:44315/api/PhieuMuon/" + id, {
                method: "DELETE",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(res => res.json())
                .then((result) => {
                    alert(result);
                    this.refreshList();
                }, (error) => {
                    alert('Failed');
                })
        }
    }

    sendEmail() {
        axios.post('https://localhost:44315/api/Mail/SendEmail')
            .then(response => {
                // Xử lý khi gửi email thành công, có thể hiển thị thông báo hoặc thực hiện các hành động khác
                alert('Email đã được gửi thành công!');
            })
            .catch(error => {
                // Xử lý khi gửi email thất bại
                console.error('Error sending email:', error);
                alert('Có lỗi xảy ra khi gửi email.');
            });
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

    handleShowDetails = (phieuMuon) => {
        this.setState({ selectedPhieuMuon: phieuMuon });
    };

    handleCloseModal = () => {
        this.setState({ selectedPhieuMuon: null });
    };


    handleUpdateStatus = (status) => {
        const { selectedPhieuMuon } = this.state;

        if (!selectedPhieuMuon) {
            alert("Chưa chọn phiếu mượn nào.");
            return;
        }

        const pm_Id = selectedPhieuMuon.Id_PhieuMuon;

        if (status === "Đã trả") {
            // Fetch Chi Tiết Phiếu Mượn
            fetch(`https://localhost:44315/api/ChiTietPhieuMuon/${pm_Id}`, {
                method: "GET",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then((res) => res.json())
                .then((chiTietPhieuMuons) => {
                    if (!chiTietPhieuMuons || chiTietPhieuMuons.length === 0) {
                        alert("Không tìm thấy Chi Tiết Phiếu Mượn cho Phiếu Mượn này.");
                        return;
                    }

                    // Chuẩn bị dữ liệu Chi Tiết Phiếu Trả
                    const chiTietPhieuTras = chiTietPhieuMuons.map((chiTiet) => ({
                        sId: chiTiet.s_Id,
                        ctptSoLuongSachTra: chiTiet.ctpm_SoLuongSachMuon
                    }));

                    // Tạo Phiếu Trả
                    const phieuTraPayload = {
                        ptNgayTra: new Date().toISOString(),
                        ndId: selectedPhieuMuon.Id_User,
                        pmId: pm_Id,
                        chiTietPhieuTras
                    };

                    fetch("https://localhost:44315/api/PhieuTra", {
                        method: "POST",
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(phieuTraPayload)
                    })
                        .then((res) => res.json())
                        .then((result) => {
                            alert("Phiếu Trả được tạo thành công!");
                            this.refreshList(); // Làm mới danh sách phiếu mượn
                        })
                        .catch((error) => {
                            console.error("Lỗi khi tạo Phiếu Trả:", error);
                            alert("Tạo Phiếu Trả thất bại.");
                        });
                })
                .catch((error) => {
                    console.error("Lỗi khi lấy Chi Tiết Phiếu Mượn:", error);
                    alert("Không thể lấy dữ liệu Chi Tiết Phiếu Mượn.");
                });
        }

        // Cập nhật trạng thái phiếu mượn
        fetch("https://localhost:44315/api/PhieuMuon", {
            method: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                pmId: pm_Id,
                ttmId: status === "Đã trả" ? 2 : 1 // 2: Đã trả, 1: Đang giữ sách
            })
        })
            .then((res) => res.json())
            .then((result) => {
                alert(`Trạng thái cập nhật thành: ${status}`);
                this.refreshList(); // Làm mới danh sách
                this.handleCloseModal(); // Đóng modal
            })
            .catch((error) => {
                console.error("Lỗi khi cập nhật trạng thái:", error);
                alert("Không thể cập nhật trạng thái.");
            });
    };

    handleUpdateXetDuyet = (status) => {
        const { selectedPhieuMuon } = this.state;

        if (!selectedPhieuMuon) {
            alert("Chưa chọn phiếu mượn nào.");
            return;
        }

        const pm_Id = selectedPhieuMuon.Id_PhieuMuon;

        fetch("https://localhost:44315/api/PhieuMuon/XetDuyet", {
            method: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                pmId: pm_Id,
                pmTrangThaiXetDuyet: status
            })
        })
            .then((res) => res.json())
            .then((result) => {
                alert(`Trạng thái xét duyệt được cập nhật thành: ${status}`);
                this.refreshList(); // Làm mới danh sách
                this.handleCloseModal(); // Đóng modal
            })
            .catch((error) => {
                console.error("Lỗi khi cập nhật xét duyệt:", error);
                alert("Không thể cập nhật trạng thái xét duyệt.");
            });
    };


    render() {
        const {
            //  phieumuons,
            modalTitle,
            pm_Id,
            pm_TrangThaiMuon,
            pm_TrangThaiXetDuyet,
            nguoidungs,
            selectedTag,
            ttm_Id
        } = this.state;

        const { selectedPhieuMuon } = this.state;


        //   const { currentPage, itemsPerPage } = this.state;
        //   const totalPages = Math.ceil(phieumuons.length / itemsPerPage);

        // Lọc dữ liệu theo trang hiện tại
        //      const indexOfLastItem = currentPage * itemsPerPage;
        //     const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        //     const currentItems = phieumuons.slice(indexOfFirstItem, indexOfLastItem);

        const { currentPage, itemsPerPage, phieumuons } = this.state;
        const totalPages = Math.ceil(phieumuons.length / itemsPerPage);
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentItems = phieumuons.slice(indexOfFirstItem, indexOfLastItem);



        return (
            <div className={cx('wrapper')}>

                <div className="row d-flex justify-content-between mb-3">
                    {/* Tiêu đề bên trái */}
                    <div className="col-4 mt-1">
                        <h3 className="fw-bold text-start mt fs-2 text-decoration-underline">Quản Lý Phiếu Mượn Tại Thư Viện</h3>

                    </div>

                    <div className=" col-8 row d-flex justify-content-end ">
                        <div className="col-3">
                            <button
                                type="button"
                                className={cx('btn-status', { 'btn-selected': selectedTag === "Chờ xét duyệt" })}
                                onClick={() => this.handleTagSelection("Chờ xét duyệt")}
                            >
                                Chờ xét duyệt
                            </button>
                        </div>
                        <div className="col-3">
                            <button
                                type="button"
                                className={cx('btn-status', { 'btn-selected': selectedTag === "Từ chối xét duyệt" })}
                                onClick={() => this.handleTagSelection("Từ chối xét duyệt")}
                            >
                                Từ chối xét duyệt
                            </button>
                        </div>
                        <div className="col-3">
                            <button
                                type="button"
                                className={cx('btn-status', { 'btn-selected': selectedTag === "Ðang mượn" })}
                                onClick={() => this.handleTagSelection("Ðang mượn")}
                            >
                                Ðang mượn
                            </button>
                        </div>

                        <div className="col-3">
                            <button
                                type="button"
                                className={cx('btn-status', { 'btn-selected': selectedTag === "Đã trả" })}
                                onClick={() => this.handleTagSelection("Đã trả")}
                            >
                                Đã trả
                            </button>
                        </div>

                    </div>
                </div>



                <div className="row mb-4 shadow-sm p-3 mb-5 bg-body-tertiary rounded align-items-center d-flex justify-content-between">
                    {/* Phần bên trái: Sắp xếp theo ngày mượn và hạn trả */}
                    <div className="col-8 d-flex align-items-center">
                        {/* Sắp xếp theo ngày mượn */}
                        <span className="me-2">Sắp xếp theo ngày mượn</span>
                        <button type="button" className="btn btn-light"
                            onClick={() => this.sortResult('NgayMuon', true)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-down-square-fill" viewBox="0 0 16 16">
                                <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5a.5.5 0 0 1 1 0z" />
                            </svg>
                        </button>

                        <button type="button" className="btn btn-light"
                            onClick={() => this.sortResult('NgayMuon', false)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-up-square-fill" viewBox="0 0 16 16">
                                <path d="M2 16a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2zm6.5-4.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 1 0z" />
                            </svg>
                        </button>

                        {/* Sắp xếp theo hạn trả */}
                        <span className="me-2 mx-5">Sắp xếp theo hạn trả</span>
                        <button type="button" className="btn btn-light"
                            onClick={() => this.sortResult('HanTra', true)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-down-square-fill" viewBox="0 0 16 16">
                                <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5a.5.5 0 0 1 1 0z" />
                            </svg>
                        </button>

                        <button type="button" className="btn btn-light"
                            onClick={() => this.sortResult('HanTra', false)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-up-square-fill" viewBox="0 0 16 16">
                                <path d="M2 16a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2zm6.5-4.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 1 0z" />
                            </svg>
                        </button>
                    </div>

                    <div className="col-2 ">
                        {/* Phần bên phải: Nút Gửi mail */}
                        {selectedTag === "Ðang mượn" && (
                            <div className="col-auto">
                                <button type="button" className={cx('btn-mail')} onClick={() => this.sendEmail()}>
                                    Gửi mail
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <table className="table table-hover shadow p-3 mb-5 bg-body-tertiary rounded w-5">
                    <thead >
                        <tr >
                            <th className="text-start">
                                ID
                            </th>
                            <th className="text-start">
                                Người mượn
                            </th>
                            <th className="text-start ">
                                Ngày Mượn
                            </th>
                            <th className="text-start ">
                                Hạn Trả
                            </th>
                            <th className="text-start">
                                Trạng Thái
                            </th>
                            {(selectedTag === "Ðang mượn" || selectedTag === "Đã trả") && (
                                <th className="text-start">
                                    Số ngày trễ hạn
                                </th>)}

                            {(selectedTag === "Chờ xét duyệt") && (
                                <th className="text-start">
                                    Số ngày còn lại để xét duyệt
                                </th>)}

                            <th >
                                Options
                            </th>
                        </tr>
                    </thead>

                    <tbody className="fs-4">
                        {currentItems.map((dep, index) => (
                            <tr key={`${dep.Id_PhieuMuon}-${dep.Id_User}-${index}`}>
                                <td className="text-start">{dep.Id_PhieuMuon}</td>
                                <td className="text-start">
                                    {nguoidungs.find(ng => ng.nd_Id === dep.Id_User)?.nd_Username} - {nguoidungs.find(ng => ng.nd_Id === dep.Id_User)?.nd_HoTen}
                                </td>
                                <td className="text-start">{new Date(dep.NgayMuon).toLocaleDateString('en-GB')}</td>
                                <td className="text-start">{new Date(dep.HanTra).toLocaleDateString('en-GB')}</td>
                                {(selectedTag === "Chờ xét duyệt" || selectedTag === "Từ chối xét duyệt") && (
                                    <td className="text-start">{dep.TrangThaiXetDuyet}</td>
                                )}

                                {(selectedTag === "Ðang mượn" || selectedTag === "Đã trả") && (
                                    <td className="text-start">{dep.TrangThaiMuon}</td>
                                )}

                                {(selectedTag === "Ðang mượn" || selectedTag === "Đã trả") && (
                                    <td className="text-start">
                                        {(() => {
                                            // Reset time to 00:00:00 for accurate day calculations
                                            const resetTime = (date) => {
                                                const newDate = new Date(date);
                                                newDate.setHours(0, 0, 0, 0);
                                                return newDate;
                                            };

                                            const currentDate = resetTime(new Date());
                                            const dueDate = resetTime(dep.HanTra);
                                            const dueDays = Math.floor((dueDate - currentDate) / (1000 * 60 * 60 * 24));

                                            if (dep.TrangThaiMuon === "Đã trả") {
                                                return dueDays < 0
                                                    ? `Trễ hạn ${Math.abs(dueDays)} ngày`
                                                    : "Đúng hạn";
                                            } else if (dep.TrangThaiMuon === "Ðang mượn") {
                                                if (dueDays < 0) {
                                                    return `${Math.abs(dueDays)} ngày (Quá hạn trả)`;
                                                } else if (dueDays > 0) {
                                                    return `Còn ${dueDays} ngày (Chưa đến hạn)`;
                                                } else {
                                                    return "Đúng hạn";
                                                }
                                            } else {
                                                if (dep.HanTra) {
                                                    return dueDays < 0
                                                        ? `Quá hạn ${Math.abs(dueDays)} ngày`
                                                        : `Còn ${dueDays} ngày (Chưa đến hạn)`;
                                                } else {
                                                    return "Chưa cập nhật hạn trả";
                                                }
                                            }
                                        })()}
                                    </td>

                                )}



                                {(selectedTag === "Chờ xét duyệt") && (
                                    <td className="text-start">
                                        {dep.HanTra ? (() => {
                                            // Reset time to 00:00:00 for accurate day calculations
                                            const resetTime = (date) => {
                                                const newDate = new Date(date);
                                                newDate.setHours(0, 0, 0, 0);
                                                return newDate;
                                            };

                                            const currentDate = resetTime(new Date());
                                            const dueDate = resetTime(dep.HanTra);
                                            const daysRemaining = Math.floor((dueDate - currentDate) / (1000 * 60 * 60 * 24));

                                            return daysRemaining >= 0
                                                ? `Còn ${daysRemaining} ngày (Chưa đến hạn)`
                                                : "Còn hạn";
                                        })()
                                            :
                                            "Chưa cập nhật hạn trả"
                                        }
                                    </td>
                                )}



                                <td >
                                    <button
                                        className="btn btn-outline-primary fs-4"
                                        onClick={() => this.handleShowDetails(dep)}
                                    >
                                        Xem chi tiết
                                    </button>

                                </td>

                            </tr>))}
                    </tbody>

                </table>

                {/* Modal hiển thị chi tiết */}
                {selectedPhieuMuon && (
                    <div className={cx("modal-overlay")}>
                        <div className={cx("modal-content", "text-start")}>
                            <h4>Chi Tiết Phiếu Mượn #{selectedPhieuMuon.Id_PhieuMuon}</h4>
                            <p>
                                <strong>Người Mượn:</strong>{" "}
                                {nguoidungs.find((nd) => nd.nd_Id === selectedPhieuMuon.Id_User)?.nd_HoTen ||
                                    "Không rõ"}
                            </p>
                            <p>
                                <strong>Ngày Mượn:</strong>{" "}
                                {new Date(selectedPhieuMuon.NgayMuon).toLocaleDateString("vi-VN")}
                            </p>
                            <p>
                                <strong>Hạn Trả:</strong>{" "}
                                {new Date(selectedPhieuMuon.HanTra).toLocaleDateString("vi-VN")}
                            </p>
                            {selectedTag === "Đã trả" && (
                                <p>
                                    <strong>Ngày trả:</strong>{" "}
                                    {new Date(selectedPhieuMuon.NgayTra).toLocaleDateString("vi-VN")}
                                </p>
                            )}
                            <p>
                                <strong>Trạng Thái:</strong> {selectedPhieuMuon.TrangThaiMuon}
                            </p>

                            {/* Danh sách sách */}
                            <div className="mt-5">
                                <strong>Bao gồm:</strong>
                                {selectedPhieuMuon.ChiTiet && selectedPhieuMuon.ChiTiet.length > 0 ? (
                                    <ul className="list-group">
                                        {selectedPhieuMuon.ChiTiet.map((sach, index) => (
                                            <li
                                                key={index}
                                                className="list-group-item d-flex justify-content-between align-items-center"
                                            >
                                                <span>{sach.TenSach}</span>
                                                <span className="badge bg-secondary">{sach.SoLuongSach}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>Không có thông tin sách.</p>
                                )}
                            </div>

                            {/* Nút cập nhật trạng thái */}

                            {selectedTag === "Chờ xét duyệt" && (
                                <div className="d-flex gap-2 mt-3">
                                    <button
                                        className="btn btn-outline-success fs-3"
                                        onClick={() => this.handleUpdateXetDuyet("Đã xét duyệt")}
                                    >
                                        Xét duyệt
                                    </button>
                                    <button
                                        className="btn btn-outline-dark fs-3"
                                        onClick={() => this.handleUpdateXetDuyet("Từ chối xét duyệt")}
                                    >
                                        Từ chối
                                    </button>
                                    <button className="btn btn-outline-danger fs-3" onClick={this.handleCloseModal}>
                                        Đóng
                                    </button>
                                </div>
                            )}


                            <div className="d-flex gap-2 mt-3">
                                {selectedTag === "Ðang mượn" && (
                                    <button
                                        className="btn btn-outline-success fs-3"
                                        onClick={() => this.handleUpdateStatus("Đã trả")}
                                    >
                                        Đánh dấu là Đã trả
                                    </button>

                                )}

                                {selectedTag === "Đang giữ sách" && (
                                    <button
                                        className="btn btn-outline-warning fs-3"
                                        onClick={() => this.handleUpdateStatus("Đã nhận sách")}
                                    >
                                        Đánh dấu là đã nhận sách
                                    </button>)}

                                {selectedTag !== "Chờ xét duyệt" && (
                                    <button className="btn btn-outline-danger fs-3" onClick={this.handleCloseModal}>
                                        Đóng
                                    </button>
                                )}
                            </div>

                        </div>
                    </div>
                )}


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



                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-hidden="true">
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{modalTitle}</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"
                                ></button>
                            </div>

                            <div className="modal-body">

                                {selectedTag === "Ðang mượn" && (
                                    <div className="input-group mb-3">
                                        <span className="input-group-text">Trạng thái</span>
                                        <select className="form-select" onChange={this.changepm_TrangThai} value={ttm_Id}>
                                            <option value="">Chọn trạng thái</option>
                                            {/* <option value={1}>Đang mượn</option> */}
                                            <option value={2}>Đã trả</option>
                                            {/* <option value={3}>Đang giữ sách</option>
                                            <option value={4}>Quá hạn nhận sách</option> */}
                                        </select>

                                    </div>)}

                                {selectedTag === "Chờ xét duyệt" && (
                                    <div className="input-group mb-3">
                                        <span className="input-group-text">Trạng thái</span>
                                        <select className="form-select"
                                            onChange={this.changepm_TrangThaiXetDuyet}
                                            value={pm_TrangThaiXetDuyet}>
                                            <option value="">Chọn trạng thái</option>
                                            <option value={"Từ chối xét duyệt"}>Từ chối xét duyệt</option>
                                            <option value={"Đã xét duyệt"}>Xét duyệt</option>
                                        </select>
                                    </div>
                                )}


                                {pm_Id === 0 ?
                                    <button type="button"
                                        className="btn btn-primary float-start"
                                        onClick={() => this.createClick()}>
                                        Create
                                    </button> : null}

                                {pm_Id !== 0 && (
                                    <>
                                        {selectedTag === "Ðang mượn" && (
                                            <button type="button"
                                                className="btn btn-primary float-start"
                                                onClick={() => this.updateClick()}>
                                                Update
                                            </button>
                                        )}
                                        {selectedTag === "Chờ xét duyệt" && (
                                            <button type="button"
                                                className="btn btn-secondary float-start"
                                                onClick={() => this.updateXetDuyetClick()}>
                                                Xét Duyệt
                                            </button>
                                        )}
                                    </>
                                )}

                            </div>
                        </div>
                    </div>
                </div>


            </div >
        )
    }
}