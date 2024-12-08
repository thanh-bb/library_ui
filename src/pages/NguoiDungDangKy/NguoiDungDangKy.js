import React, { Component } from "react";
import classNames from 'classnames/bind';
import styles from './NguoiDungDangKy.module.scss';
import { Link } from "react-router-dom";

const cx = classNames.bind(styles);

export class NguoiDungDangKy extends Component {
    constructor(props) {
        super(props);

        this.state = {
            nguoidungdangkys: [],
            nddk_Id: "",
            nddk_HoTen: "",
            nddk_SoDienThoai: "",
            nddk_CCCD: "",
            nddk_CCCD_MatTruoc: "",
            nddk_CCCD_MatSau: "",
            nddk_Email: "",
            nddk_NgayDangKy: "",
            nddk_TrangThaiDuyet: "",
            modalTitle: "",
            nddk_CCCDFilter: "",
            nddk_HoTenFilter: "",
            nguoidungdangkysWithoutFilter: [],
            selectedTag: "Chưa xét duyệt",


            currentPage: 1,
            itemsPerPage: 10,
            totalPages: 0
        }
    }
    handleTagSelection = (tag) => {
        this.setState({ selectedTag: tag }, () => {
            this.FilterFn();
        });
    }

    FilterFn() {
        const { nddk_CCCDFilter, nddk_HoTenFilter, selectedTag, nguoidungdangkysWithoutFilter } = this.state;

        const filteredData = nguoidungdangkysWithoutFilter.filter(el => {
            return (
                el.nddk_HoTen?.toString().toLowerCase().includes(nddk_HoTenFilter.toString().trim().toLowerCase()) &&
                el.nddk_CCCD?.toString().toLowerCase().includes(nddk_CCCDFilter.toString().trim().toLowerCase()) &&
                el.nddk_TrangThaiDuyet === selectedTag
            );
        });

        this.setState({ nguoidungdangkys: filteredData });
    }

    sortResult(prop, asc) {
        const sortedData = this.state.nguoidungdangkysWithoutFilter.sort((a, b) => {
            if (asc) {
                return a[prop] > b[prop] ? 1 : a[prop] < b[prop] ? -1 : 0;
            } else {
                return b[prop] > a[prop] ? 1 : b[prop] < a[prop] ? -1 : 0;
            }
        });

        this.setState({ nguoidungdangkys: sortedData });
    }

    changend_CCCDFilter = (e) => {
        this.setState({ nddk_CCCDFilter: e.target.value }, () => {
            this.FilterFn();
        });
    }

    changend_HoTenFilter = (e) => {
        this.setState({ nddk_HoTenFilter: e.target.value }, () => {
            this.FilterFn();
        });
    }

    refreshList() {
        fetch("https://localhost:44315/api/NguoiDungDangKy/GetSomeInfor")
            .then(response => response.json())
            .then(data => {
                const totalPages = Math.ceil(data.length / this.state.itemsPerPage);
                this.setState({
                    nguoidungdangkys: data.filter(user => user.nddk_TrangThaiDuyet === this.state.selectedTag),
                    nguoidungdangkysWithoutFilter: data,
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


    // Chuyển trang trước
    prevPage = () => {
        this.setState((prevState) => ({
            currentPage: prevState.currentPage > 1 ? prevState.currentPage - 1 : 1
        }));
    }

    // Chuyển sang trang kế tiếp
    nextPage = () => {
        const { currentPage } = this.state;
        const totalPages = Math.ceil(this.state.danhmucs.length / this.state.itemsPerPage);
        this.setState({
            currentPage: currentPage < totalPages ? currentPage + 1 : currentPage
        });
    }

    // Chuyển đến trang cụ thể
    goToPage = (pageNumber) => {
        this.setState({ currentPage: pageNumber });
    }

    render() {
        const { nguoidungdangkys, selectedTag } = this.state;

        const { currentPage, itemsPerPage } = this.state;
        const totalPages = Math.ceil(nguoidungdangkys.length / itemsPerPage);

        // Lọc dữ liệu theo trang hiện tại
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentItems = nguoidungdangkys.slice(indexOfFirstItem, indexOfLastItem);



        return (
            <div className={cx('wrapper')}>
                <div className="row d-flex justify-content-end mb-3">
                    <div className="col-2">
                        <button
                            type="button"
                            className={cx('btn-status', { 'btn-selected': selectedTag === "Chưa xét duyệt" })}
                            onClick={() => this.handleTagSelection("Chưa xét duyệt")}

                        >
                            Chưa xét duyệt
                        </button>
                    </div>
                    <div className="col-2">
                        <button
                            type="button"
                            className={cx('btn-status', { 'btn-selected': selectedTag === "Đã xét duyệt" })}
                            onClick={() => this.handleTagSelection("Đã xét duyệt")}
                        >
                            Đã xét duyệt
                        </button>
                    </div>
                </div>


                <div className="row mb-4 shadow-sm p-3 mb-5 bg-body-tertiary rounded">
                    <div className="col-6">
                        <div className="d-flex flex-row">
                            <input className="form-control m-2 fs-4"
                                onChange={this.changend_HoTenFilter}
                                placeholder="Tìm theo Họ Tên" />

                            <button type="button" className="btn btn-light"
                                onClick={() => this.sortResult('nddk_HoTen', true)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-down-square-fill" viewBox="0 0 16 16">
                                    <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5a.5.5 0 0 1 1 0z" />
                                </svg>
                            </button>

                            <button type="button" className="btn btn-light"
                                onClick={() => this.sortResult('nddk_HoTen', false)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-up-square-fill" viewBox="0 0 16 16">
                                    <path d="M2 16a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2zm6.5-4.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 1 0z" />
                                </svg>
                            </button>

                        </div>
                    </div>

                    <div className="col-6">
                        <div className="d-flex flex-row">
                            <input className="form-control m-2 fs-4"
                                onChange={this.changend_CCCDFilter}
                                placeholder="Tìm theo CCCD" />

                            <button type="button" className="btn btn-light"
                                onClick={() => this.sortResult('nddk_CCCD', true)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-down-square-fill" viewBox="0 0 16 16">
                                    <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5a.5.5 0 0 1 1 0z" />
                                </svg>
                            </button>

                            <button type="button" className="btn btn-light"
                                onClick={() => this.sortResult('nddk_CCCD', false)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-up-square-fill" viewBox="0 0 16 16">
                                    <path d="M2 16a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2zm6.5-4.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 1 0z" />
                                </svg>
                            </button>
                        </div >
                    </div>

                </div>
                <table className="table table-hover shadow p-3 mb-5 bg-body-tertiary rounded w-5">
                    <thead >
                        <tr >
                            <th className="text-start w-25 ">
                                Họ tên
                            </th>
                            <th className="text-start">
                                Ngày đăng ký
                            </th>
                            <th className="text-start">
                                CCCD
                            </th>
                            <th className="text-start">
                                Email
                            </th>
                            <th className="text-start">
                                Trạng thái xét duyệt
                            </th>
                            {selectedTag !== "Đã xét duyệt" ? (
                                <th>
                                    Tùy chọn
                                </th>
                            ) : null}

                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map(dep =>

                            <tr key={dep.nddk_Id}>
                                <td className="text-start">{dep.nddk_HoTen}</td>
                                <td className="text-start">
                                    {new Date(dep.nddk_NgayDangKy).toLocaleDateString('en-GB')}
                                </td>
                                <td className="text-start">{dep.nddk_CCCD}</td>
                                <td className="text-start">{dep.nddk_Email}</td>
                                <td className="text-start">{dep.nddk_TrangThaiDuyet}</td>
                                {dep.nddk_TrangThaiDuyet !== "Đã xét duyệt" ? (
                                    <td className="position-relative">

                                        <Link to={`/admin/chitietNDDK/${dep.nddk_Id}`}
                                            className="btn btn-light mr-1 "
                                        >

                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                                <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                                            </svg>

                                        </Link>
                                    </td>
                                ) : null}
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

            </div >
        )
    }
}