import React, { Component } from "react";
import classNames from 'classnames/bind';
import styles from './TacGia.module.scss';


const cx = classNames.bind(styles);

export class TacGia extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tacgias: [],
            modalTitle: "",
            tg_TenTacGia: "",
            tg_Id: 0,

            tg_IdFilter: "",
            tg_TenTacGiaFilter: "",
            tacgiasWithoutFilter: [],

            validationError: "",


            currentPage: 1,
            itemsPerPage: 7,
            totalPages: 0
        }
    }

    FilterFn() {
        var tg_IdFilter = this.state.tg_IdFilter;
        var tg_TenTacGiaFilter = this.state.tg_TenTacGiaFilter;

        var filteredData = this.state.tacgiasWithoutFilter.filter(
            function (el) {
                return (
                    el.tg_Id?.toString().toLowerCase().includes(
                        tg_IdFilter.toString().trim().toLowerCase()
                    ) &&
                    el.tg_TenTacGia?.toString().toLowerCase().includes(
                        tg_TenTacGiaFilter.toString().trim().toLowerCase()
                    )
                );
            }
        );
        this.setState({ tacgias: filteredData });

    }

    sortResult(prop, asc) {
        var sortedData = this.state.tacgiasWithoutFilter.sort(function (a, b) {
            if (asc) {
                return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
            }
            else {
                return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
            }
        });

        this.setState({ tacgias: sortedData });
    }

    changetg_IdFilter = (e) => {
        this.setState({ tg_IdFilter: e.target.value }, () => {
            this.FilterFn();
        });
    }

    changetg_TenTacGiaFilter = (e) => {
        this.setState({ tg_TenTacGiaFilter: e.target.value }, () => {
            this.FilterFn();
        });
    }

    refreshList() {
        fetch("https://localhost:44315/api/TacGium")
            .then(response => response.json())
            .then(data => {
                const totalPages = Math.ceil(data.length / this.state.itemsPerPage);
                this.setState({
                    tacgias: data,
                    tacgiasWithoutFilter: data,
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

    changetg_TenTacGia = (e) => {
        this.setState({ tg_TenTacGia: e.target.value });
    }

    addClick() {
        this.setState({
            modalTitle: "Thêm Tác Giả",
            tg_Id: 0,
            tg_TenTacGia: ""
        });
    }

    editClick(dep) {
        this.setState({
            modalTitle: "Chỉnh sửa Tác Giả",
            tg_Id: dep.tg_Id,
            tg_TenTacGia: dep.tg_TenTacGia
        });
    }

    createClick() {
        if (!this.state.tg_TenTacGia) {
            this.setState({ validationError: "Tên Tác Giả không được trống" });
            return;
        }

        fetch("https://localhost:44315/api/TacGium", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                tgTenTacGia: this.state.tg_TenTacGia // Thay tg_TenTacGia thành tgTenTacGia
            })
        })
            .then(res => res.json())
            .then((result) => {
                alert(result);
                this.refreshList();
                this.clearForm();
                window.location.href = '/admin/tacgia';
            }, (error) => {
                alert('Failed');
            })
    }

    updateClick() {
        if (!this.state.tg_TenTacGia) {
            this.setState({ validationError: "Tên Tác Giả không được trống" });
            return;
        }

        fetch("https://localhost:44315/api/TacGium", {
            method: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                tgId: this.state.tg_Id,
                tgTenTacGia: this.state.tg_TenTacGia // Thay tg_TenTacGia thành tgTenTacGia
            })
        })
            .then(res => res.json())
            .then((result) => {
                alert(result);
                this.refreshList();
                this.clearForm();
            }, (error) => {
                alert('Failed');
            })
    }

    deleteClick(id) {
        if (window.confirm("Ban co chac chan muon xoa?")) {
            fetch("https://localhost:44315/api/TacGium/" + id, {
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

    clearForm() {
        this.setState({
            tg_Id: 0,
            tg_TenTacGia: "",
            validationError: ""
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
        const {
            tacgias,
            modalTitle,
            tg_Id,
            tg_TenTacGia
        } = this.state;

        const { currentPage, itemsPerPage } = this.state;
        const totalPages = Math.ceil(tacgias.length / itemsPerPage);

        // Lọc dữ liệu theo trang hiện tại
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentItems = tacgias.slice(indexOfFirstItem, indexOfLastItem);


        return (
            <div className={cx('wrapper')}>
                <button type="button"
                    className={cx('btn-grad')}
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                    onClick={() => this.addClick()}>
                    +
                </button>

                <div className="row mb-4 shadow-sm p-3 mb-5 bg-body-tertiary rounded">
                    <div className="col-6">
                        <div className="d-flex flex-row">
                            <input className="form-control m-2 fs-4"
                                onChange={this.changetg_IdFilter}
                                placeholder="Tìm theo ID" />

                            <button type="button" className="btn btn-light"
                                onClick={() => this.sortResult('tg_Id', true)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-down-square-fill" viewBox="0 0 16 16">
                                    <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5a.5.5 0 0 1 1 0z" />
                                </svg>
                            </button>

                            <button type="button" className="btn btn-light"
                                onClick={() => this.sortResult('tg_Id', false)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-up-square-fill" viewBox="0 0 16 16">
                                    <path d="M2 16a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2zm6.5-4.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 1 0z" />
                                </svg>
                            </button>

                        </div>
                    </div>
                    <div className="col-6">
                        <div className="d-flex flex-row">
                            <input className="form-control m-2 fs-4"
                                onChange={this.changetg_TenTacGiaFilter}
                                placeholder="Tìm theo ký tự" />

                            <button type="button" className="btn btn-light"
                                onClick={() => this.sortResult('tg_TenTacGia', true)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-down-square-fill" viewBox="0 0 16 16">
                                    <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5a.5.5 0 0 1 1 0z" />
                                </svg>
                            </button>

                            <button type="button" className="btn btn-light"
                                onClick={() => this.sortResult('tg_TenTacGia', false)}>
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
                                ID Tác Giả
                            </th>
                            <th className="text-start">
                                Tên Tác Giả
                            </th>
                            <th>
                                Options
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map(dep =>
                            <tr key={dep.tg_Id}>
                                <td className="text-start">{dep.tg_Id}</td>
                                <td className="text-start">{dep.tg_TenTacGia}</td>
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

                                    <button type="button"
                                        className="btn btn-light mr-1"
                                        onClick={() => this.deleteClick(dep.tg_Id)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
                                            <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0" />
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
                                    <span className="input-group-text fw-bold">Tên Tác Giả</span>
                                    <input type="text" className="form-control fs-2"
                                        value={tg_TenTacGia}
                                        onChange={this.changetg_TenTacGia} />
                                </div>

                                {this.state.validationError && (
                                    <p className="fw-bold text-danger float-start fs-4" role="alert">
                                        Lưu ý: {this.state.validationError}
                                    </p>
                                )}


                                {tg_Id === 0 ?
                                    <button type="button"
                                        className={cx('btn-create')}
                                        onClick={() => this.createClick()}>
                                        Thêm
                                    </button> : null}

                                {tg_Id !== 0 ?
                                    <button type="button"
                                        className={cx('btn-create')}
                                        onClick={() => this.updateClick()}>
                                        Cập nhật
                                    </button> : null}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}