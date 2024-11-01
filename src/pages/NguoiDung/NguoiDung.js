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
            itemsPerPage: 8,
            totalPages: 0
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
        this.setState({ nd_Active: e.target.value });
    }

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
                alert(result);
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
                            <th>
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
                                        onClick={() => this.editClick(dep)}>
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

                <div className="modal fade " id="exampleModal" tabIndex="-1" aria-hidden="true">
                    <div className="modal-dialog modal-lg modal-dialog-centered ">
                        <div className="modal-content  w-75 position-absolute top-50 start-50 translate-middle">
                            <div className="modal-header">
                                <h5 className="modal-title fs-2">{modalTitle}</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"
                                ></button>
                            </div>

                            <div className="modal-body">
                                <div className="input-group mb-3 input-group-lg">
                                    <span className="input-group-text fw-bold">Trạng thái tài khoản</span>
                                    <select className="form-select form-control fs-2"
                                        onChange={this.changend_Active}
                                        value={nd_active}>
                                        <option value="">Chọn trạng thái</option>
                                        <option value={true}>Kích hoạt lại</option>
                                        <option value={false}>Khóa tài khoản</option>
                                    </select>
                                </div>


                                {nd_Id === 0 ?
                                    <button type="button"
                                        className={cx('btn-create')}
                                        onClick={() => this.createClick()}>
                                        Create
                                    </button> : null}

                                {nd_Id !== 0 ?
                                    <button type="button"
                                        className={cx('btn-create')}
                                        onClick={() => this.updateClick()}>
                                        Update
                                    </button> : null}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}