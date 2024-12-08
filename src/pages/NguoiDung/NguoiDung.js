import React, { Component } from "react";
import classNames from 'classnames/bind';
import styles from './NguoiDung.module.scss';


const cx = classNames.bind(styles);

export class NguoiDung extends Component {
    constructor(props) {
        super(props);

        this.state = {
            nguoidungs: [],
            modalTitle: "",
            nd_Username: "",
            nd_Id: 0,
            nd_HoTen: "",
            nd_IdFilter: "",
            nd_UsernameFilter: "",
            nd_HoTenFilter: "",
            nguoidungsWithoutFilter: [],


            currentPage: 1,
            itemsPerPage: 15,
            totalPages: 0,

            userDetails: null,
            userViolations: [],


            nd_Active: null, // Giá trị trạng thái tài khoản
            isOptionSelected: false, // Theo dõi việc chọn option
        }
    }

    FilterFn() {
        var nd_UsernameFilter = this.state.nd_UsernameFilter;
        var nd_HoTenFilter = this.state.nd_HoTenFilter;

        var filteredData = this.state.nguoidungsWithoutFilter.filter(
            function (el) {
                return (
                    el.nd_Username?.toString().toLowerCase().includes(
                        nd_UsernameFilter.toString().trim().toLowerCase()
                    ) &&
                    el.nd_HoTen?.toString().toLowerCase().includes(
                        nd_HoTenFilter.toString().trim().toLowerCase()
                    )
                );
            }
        );
        this.setState({ nguoidungs: filteredData });
    }

    sortResult(prop, asc) {
        var sortedData = this.state.nguoidungsWithoutFilter.sort(function (a, b) {
            if (asc) {
                return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
            }
            else {
                return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
            }
        });

        this.setState({ nguoidungs: sortedData });
    }

    changend_UsernameFilter = (e) => {
        this.setState({ nd_UsernameFilter: e.target.value }, () => {
            this.FilterFn();
        });
    }

    changend_HoTenFilter = (e) => {
        this.setState({ nd_HoTenFilter: e.target.value }, () => {
            this.FilterFn();
        });
    }


    refreshList() {
        fetch("https://localhost:44315/api/NguoiDung")
            .then(response => response.json())
            .then(data => {
                const totalPages = Math.ceil(data.length / this.state.itemsPerPage);
                this.setState({
                    nguoidungs: data,
                    nguoidungsWithoutFilter: data,  // Update nguoidungsWithoutFilter with fetched data
                    totalPages: totalPages

                });
            })
            .catch(error => {
                console.error('Error fetching data: ', error);
            });
    }


    componentDidMount() {
        this.refreshList();
    }

    changend_Username = (e) => {
        this.setState({ nd_Username: e.target.value });
    }
    changend_HoTen = (e) => {
        this.setState({ nd_HoTen: e.target.value });
    }


    changend_Active = (e) => {
        const selectedValue = e.target.value;

        // Kiểm tra nếu giá trị được chọn khác giá trị hiện tại
        this.setState({
            nd_Active: selectedValue,
            isOptionSelected: selectedValue !== "" && selectedValue !== this.state.nd_active,
        });
    };


    addClick() {
        this.setState({
            modalTitle: "Add NguoiDung",
            nd_Id: 0,
            nd_Username: ""
        });
    }

    editClick(dep) {
        this.setState({
            modalTitle: "Edit Trạng Thái",
            nd_Id: dep.nd_Id,
            nd_Active: dep.nd_Active
        });
    }

    createClick() {
        fetch("https://localhost:44315/api/NguoiDung", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ndActive: this.state.nd_Active // Thay nd_Username thành dmTenNguoiDung
            })
        })
            .then(res => res.json())
            .then((result) => {
                alert(result);
                this.refreshList();
            }, (error) => {
                alert('Failed');
            })
    }

    updateClick() {
        // console.log({
        //     ndId: this.state.nd_Id,
        //     ndActive: this.state.nd_Active
        // })
        fetch("https://localhost:44315/api/NguoiDung", {
            method: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ndId: this.state.nd_Id,
                ndActive: this.state.nd_Active
            })
        })
            .then(res => res.json())
            .then((result) => {
                alert("Cập nhật trạng thái tài khoản thành công");
                this.refreshList();
            }, (error) => {
                alert('Failed');
            })
    }


    deleteClick(id) {
        if (window.confirm("Ban co chac chan muon xoa?")) {
            fetch("https://localhost:44315/api/NguoiDung/" + id, {
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

    // Chuyển trang trước
    prevPage = () => {
        this.setState((prevState) => ({
            currentPage: prevState.currentPage > 1 ? prevState.currentPage - 1 : 1
        }));
    }

    // Chuyển sang trang kế tiếp
    nextPage = () => {
        const { currentPage } = this.state;
        const totalPages = Math.ceil(this.state.nguoidungs.length / this.state.itemsPerPage);
        this.setState({
            currentPage: currentPage < totalPages ? currentPage + 1 : currentPage
        });
    }

    // Chuyển đến trang cụ thể
    goToPage = (pageNumber) => {
        this.setState({ currentPage: pageNumber });
    }

    fetchUserDetails = (id) => {
        fetch(`https://localhost:44315/api/NguoiDung/${id}`)
            .then((response) => response.json())
            .then((data) => {
                this.setState({
                    userDetails: data[0], // Lưu thông tin người dùng vào state
                });
            })
            .catch((error) => {
                console.error("Error fetching user details: ", error);
            });
    };

    handleEditUser = (dep) => {
        this.fetchUserDetails(dep.nd_Id); // Lấy thông tin cá nhân
        this.fetchUserViolations(dep.nd_Id); // Lấy thông tin vi phạm
        this.setState({
            modalTitle: "Thông tin chi tiết người dùng",
            nd_Id: dep.nd_Id,
            nd_Active: dep.nd_Active
        });
    };


    fetchUserViolations = (id) => {
        fetch(`https://localhost:44315/api/NguoiDung/GetViolations/${id}`)
            .then((response) => response.json())
            .then((data) => {
                this.setState({
                    userViolations: data, // Lưu danh sách vi phạm vào state
                });
            })
            .catch((error) => console.error("Error fetching user violations:", error));
    };



    render() {
        const {
            nguoidungs,
            modalTitle,
            nd_Id,
            nd_active

        } = this.state;

        const { currentPage, itemsPerPage } = this.state;
        const totalPages = Math.ceil(nguoidungs.length / itemsPerPage);

        // Lọc dữ liệu theo trang hiện tại
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentItems = nguoidungs.slice(indexOfFirstItem, indexOfLastItem);


        return (
            <div className={cx('wrapper')}>
                <div className="row mb-4 shadow-sm p-3 mb-5 bg-body-tertiary rounded">
                    <div className="col-6">
                        <div className="d-flex flex-row">
                            <input className="form-control m-2 fs-4"
                                onChange={this.changend_UsernameFilter}
                                placeholder="Tìm theo ký tự" />

                            <button type="button" className="btn btn-light"
                                onClick={() => this.sortResult('nd_Username', true)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-down-square-fill" viewBox="0 0 16 16">
                                    <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5a.5.5 0 0 1 1 0z" />
                                </svg>
                            </button>

                            <button type="button" className="btn btn-light"
                                onClick={() => this.sortResult('nd_Username', false)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-up-square-fill" viewBox="0 0 16 16">
                                    <path d="M2 16a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2zm6.5-4.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 1 0z" />
                                </svg>
                            </button>
                        </div >
                    </div>
                    <div className="col-6">
                        <div className="d-flex flex-row">
                            <input className="form-control m-2 fs-4"
                                onChange={this.changend_HoTenFilter}
                                placeholder="Tìm theo Họ Tên" />

                            <button type="button" className="btn btn-light"
                                onClick={() => this.sortResult('nd_HoTen', true)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-down-square-fill" viewBox="0 0 16 16">
                                    <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5a.5.5 0 0 1 1 0z" />
                                </svg>
                            </button>

                            <button type="button" className="btn btn-light"
                                onClick={() => this.sortResult('nd_HoTen', false)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-up-square-fill" viewBox="0 0 16 16">
                                    <path d="M2 16a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2zm6.5-4.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 1 0z" />
                                </svg>
                            </button>

                        </div>
                    </div>
                </div>


                <table className="table table-hover shadow p-3 mb-5 bg-body-tertiary rounded w-5">
                    <thead >
                        <tr >
                            <th className="text-start ">
                                ID
                            </th>
                            <th className="text-start w-25">

                                Username
                            </th>
                            <th className="text-start w-25 ">

                                Tên Người Dùng
                            </th>
                            <th>
                                Giới tính
                            </th>
                            <th>
                                Ngày đăng ký
                            </th>
                            <th>
                                Trạng thái
                            </th>
                            <th>
                                Options
                            </th>

                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map(dep =>

                            <tr key={dep.nd_Id}>
                                <td className="text-start">{dep.nd_Id}</td>
                                <td className="text-start">{dep.nd_Username}</td>
                                <td className="text-start">{dep.nd_HoTen}</td>
                                <td className="text-start">{dep.nd_GioiTinh}</td>
                                <td className="text-start">
                                    {new Date(dep.nd_NgayDangKy).toLocaleDateString('en-GB')}
                                </td>
                                <td className="text-start">
                                    {dep.nd_active === true ? "Đang hoạt động" : dep.nd_active === false ? "Đã bị khóa" : "Trạng thái không xác định"}
                                </td>

                                <td className="position-relative">
                                    <button type="button"
                                        className="btn btn-light mr-1 "
                                        data-bs-toggle="modal"
                                        data-bs-target="#exampleModal"
                                        onClick={() => this.handleEditUser(dep)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                            <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                                        </svg>
                                    </button>


                                </td>

                            </tr>)}
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

                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-hidden="true">
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content border-0 shadow">
                            {/* Header */}
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title fs-3">{this.state.modalTitle}</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                ></button>
                            </div>

                            {/* Body */}
                            <div className="modal-body">
                                {/* Card Hiển thị Thông tin Người Dùng */}
                                <div className="card mb-4 border-0 shadow-sm">
                                    <div className="card-body d-flex align-items-center">
                                        <div className="me-5">
                                            <img
                                                src={
                                                    this.state.userDetails?.nd_HinhThe
                                                        ? `https://localhost:44315/Photos/${this.state.userDetails.nd_HinhThe}`
                                                        : 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg'
                                                }
                                                alt="Hình thẻ"
                                                className="rounded-circle"
                                                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                            />
                                        </div>
                                        <div className="text-start fs-4 mx-5">
                                            <p><strong>Username:</strong> {this.state.userDetails?.nd_Username}</p>
                                            <p><strong>Họ tên:</strong> {this.state.userDetails?.nd_HoTen}</p>
                                            <p><strong>Ngày sinh:</strong> {new Date(this.state.userDetails?.nd_NgaySinh).toLocaleDateString('en-GB')}</p>
                                            <p><strong>Giới tính:</strong> {this.state.userDetails?.nd_GioiTinh}</p>
                                            <p><strong>Số CCCD:</strong> {this.state.userDetails?.nd_CCCD}</p>
                                            <p><strong>Số điện thoại:</strong> {this.state.userDetails?.nd_SoDienThoai}</p>

                                        </div>
                                        <div className="text-start fs-4 mx-5">
                                            <p><strong>Email:</strong> {this.state.userDetails?.nd_Email}</p>
                                            <p><strong>Địa chỉ:</strong> {this.state.userDetails?.nd_DiaChi}</p>
                                            <p><strong>Ngày đăng ký:</strong> {new Date(this.state.userDetails?.nd_NgayDangKy).toLocaleDateString('en-GB')}</p>
                                            <p><strong>Thời gian sử dụng:</strong> {this.state.userDetails?.nd_ThoiGianSuDung}</p>
                                            <p>
                                                <strong>Đối tượng:</strong>{" "}
                                                {this.state.userDetails?.lnd_LoaiNguoiDung === 1 ? "Sinh viên của trường" : "Bạn đọc ngoài nhà trường"}
                                            </p>
                                            <p>
                                                <strong>Trạng thái tài khoản:</strong>{" "}
                                                {this.state.userDetails?.nd_active
                                                    ? "Đang hoạt động"
                                                    : this.state.userDetails?.nd_active === false
                                                        ? "Đã bị khóa"
                                                        : "Không xác định"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Selection Trạng Thái Tài Khoản */}
                                <div className="card mb-4 border-0 shadow-sm">
                                    <div className="card-body text-start">
                                        <label className="fw-bold mb-2 text-start">Chỉnh sửa trạng thái tài khoản</label>
                                        <select
                                            className="form-select fs-4 w-50"
                                            onChange={this.changend_Active}
                                            value={this.state.nd_active}
                                        >
                                            <option value={null}>Chọn trạng thái</option>
                                            <option value={true}>Kích hoạt tài khoản</option>
                                            <option value={false}>Khóa tài khoản</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Bảng Chi tiết Vi phạm */}
                                <div className="card border-0 shadow-sm">
                                    <div className="card-header bg-primary-subtle  fw-bold">
                                        Chi tiết vi phạm
                                    </div>
                                    <div className="card-body">
                                        {this.state.userViolations.length > 0 ? (
                                            <table className="table table-hover">
                                                <thead className="table-light">
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Mã phiếu mượn</th>
                                                        <th>Ngày mượn</th>
                                                        <th>Hạn trả</th>
                                                        <th>Ngày trả</th>
                                                        <th>Số ngày trễ</th>
                                                        <th>Loại vi phạm</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {this.state.userViolations.map((violation, index) => (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{violation.pm_Id}</td>
                                                            <td>{new Date(violation.pm_NgayMuon).toLocaleDateString('en-GB')}</td>
                                                            <td>{new Date(violation.pm_HanTra).toLocaleDateString('en-GB')}</td>
                                                            <td>{new Date(violation.pt_NgayTra).toLocaleDateString('en-GB')}</td>
                                                            <td>{violation.SoNgayTre}</td>
                                                            <td className="text-danger">{violation.LoaiViPham}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        ) : (
                                            <p className="text-center text-muted">Người dùng không có vi phạm.</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="modal-footer bg-light">
                                {this.state.isOptionSelected && (
                                    <button
                                        type="button"
                                        className="btn btn-primary fs-3 fw-bold"
                                        onClick={() => this.updateClick()}
                                    >
                                        Cập nhật
                                    </button>)}
                                <button
                                    type="button"
                                    className="btn btn-secondary fs-3 fw-bold"
                                    data-bs-dismiss="modal"
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}