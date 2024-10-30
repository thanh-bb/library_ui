import React, { Component } from "react";
import classNames from 'classnames/bind';
import styles from './QuanLyPhieuMuonOnline.module.scss';
import { Link } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';

const cx = classNames.bind(styles);

export class QuanLyPhieuMuonOnline extends Component {
    constructor(props) {
        super(props);

        this.state = {
            chitietpmos: [],
            tenSachFilter: '',
            tensachWithoutFilter: [],// Khởi tạo mảng chitietpmsWithoutFilter
            selectedTag: "Nhận trực tiếp tại thư viện",
            phieumuonWithoutFilter: [],
            phieumuononls: [],
            PmoLoaiGiaoHang: "",
            PmoPhuongThucThanhToan: "",
            PmoTrangThai: ""
        }
    }

    handleTenSachFilterChange = (e) => {
        this.setState({ tenSachFilter: e.target.value });
    }

    sortResult(prop, asc) {
        var sortedData = this.state.tensachWithoutFilter.sort(function (a, b) {
            if (asc) {
                return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
            }
            else {
                return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
            }
        });

        this.setState({ chitietpmos: sortedData });
    }

    refreshList() {
        const token = sessionStorage.getItem('jwttoken');
        if (token) {
            const decodedToken = jwtDecode(token);
            const nd_id = decodedToken.nameid;

            fetch(`https://localhost:44315/api/PhieuMuonOnline/${nd_id}`)
                .then(response => response.json())
                .then(data => {
                    this.setState({
                        chitietpmos: data.filter(pm => pm.PmoTrangThai === this.state.selectedTag || pm.PmoLoaiGiaoHang === this.state.selectedTag || pm.PmoPhuongThucThanhToan === this.state.selectedTag),
                        tensachWithoutFilter: data,
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
    }

    FilterFn() {
        const { selectedTag, tensachWithoutFilter } = this.state;

        // Lọc dựa trên selectedTag
        const filteredData = tensachWithoutFilter.filter(el => {
            return (
                el.PmoTrangThai === selectedTag || el.PmoPhuongThucThanhToan === selectedTag || el.PmoLoaiGiaoHang === selectedTag
            );
        });

        console.log("Dữ liệu sau khi lọc:", filteredData); // Kiểm tra dữ liệu sau khi lọc
        this.setState({ phieumuononls: filteredData });
    }




    // Phân loại trạng thái
    handleTagSelection = (tag) => {
        this.setState({ selectedTag: tag }, () => {
            this.FilterFn();
        });
    }


    render() {

        const { phieumuononls, tenSachFilter } = this.state;

        // const filteredChitietpms = chitietpms.filter(pm =>
        //     pm.TenSach.toLowerCase().includes(tenSachFilter.toLowerCase())
        // );

        const { selectedTag } = this.state;


        return (
            <div className={cx('wrapper')}>
                <div className="row d-flex justify-content-end mb-3">
                    <h1 className="fw-bold mt-5 mb-5 ">Phiếu Mượn Sách Online</h1>
                    <hr></hr>
                    <div className="col-3">
                        <button
                            type="button"
                            className={cx('btn-status', { 'btn-selected': selectedTag === "Nhận trực tiếp tại thư viện" })}
                            onClick={() => this.handleTagSelection("Nhận trực tiếp tại thư viện")}

                        >
                            Nhận trực tiếp
                        </button>
                    </div>
                    <div className="col-3">
                        <button
                            type="button"
                            className={cx('btn-status', { 'btn-selected': selectedTag === "Giao sách tận nơi" })}
                            onClick={() => this.handleTagSelection("Giao sách tận nơi")}

                        >
                            Giao tận nơi
                        </button>
                    </div>
                    <div className="col-3">
                        <button
                            type="button"
                            className={cx('btn-status', { 'btn-selected': selectedTag === "Đã hoàn thành" })}
                            onClick={() => this.handleTagSelection("Đã hoàn thành")}
                        >
                            Đã hoàn thành
                        </button>
                    </div>
                </div>

                <div className="row mb-4 shadow-sm p-3 mb-5 bg-body-tertiary rounded">
                    <div className="d-flex flex-row w-100 mb-2">
                        <input className="form-control m-2 fs-3 p-2 w-100"
                            type="text"
                            placeholder="Tìm kiếm theo tên sách"
                            value={tenSachFilter}
                            onChange={this.handleTenSachFilterChange}
                        />
                        <button type="button" className="btn btn-light"
                            onClick={() => this.sortResult('TenSach', true)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-down-square-fill" viewBox="0 0 16 16">
                                <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5a.5.5 0 0 1 1 0z" />
                            </svg>
                        </button>

                        <button type="button" className="btn btn-light"
                            onClick={() => this.sortResult('TenSach', false)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-up-square-fill" viewBox="0 0 16 16">
                                <path d="M2 16a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2zm6.5-4.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 1 0z" />
                            </svg>
                        </button>
                    </div>
                </div>
                <table className="table table-hover shadow p-3 mb-5 bg-body-tertiary rounded w-5">
                    <thead >
                        <tr>
                            <th className="text-start">ID đơn hàng</th>
                            <th className="text-start">Tên sách</th>
                            <th className="text-center">
                                Ngày đặt
                            </th>
                            <th className="text-center">Số lượng</th>

                            {(selectedTag === "Nhận trực tiếp tại thư viện" && (
                                <>
                                    <th className="text-center ">Phương thức nhận sách</th>
                                    <th className="text-center">Trạng Thái Nhận Sách</th>
                                </>

                            ))}

                            {(selectedTag !== "Nhận trực tiếp tại thư viện" && (
                                <>
                                    <th className="text-center">Phương Thức Thanh Toán</th>
                                    <th className="text-center">Trạng Thái Thanh Toán</th>
                                    <th className="text-center">Trạng Thái Giao Hàng</th>
                                </>

                            ))}

                            <th className="text-center ">Hạn Trả</th>
                            <th className="text-center">Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        {phieumuononls.map(dep =>
                            <tr key={dep.PmoId}>
                                <td className="text-start">{dep.PmoId}</td>
                                <td className="text-start">{dep.TenSach}</td>
                                <td className="text-center">{new Date(dep.PmoNgayDat).toLocaleDateString('en-GB')}</td>
                                <td className="text-center">{dep.SoLuongSach}</td>


                                {(selectedTag === "Nhận trực tiếp tại thư viện" &&
                                    <>
                                        <td className="text-center">{dep.PmoLoaiGiaoHang}</td>
                                        <td className="text-center">{dep.PmoTrangThai}</td>
                                    </>
                                )}

                                {(selectedTag !== "Nhận trực tiếp tại thư viện" &&
                                    <>
                                        <td className="text-center">{dep.TtPhuongThuc}</td>
                                        <td className="text-center">{dep.TtTrangThai}</td>
                                        <td className="text-center">{dep.PmoTrangThai}</td>
                                    </>
                                )}


                                <td className="text-center">{new Date(dep.HanTra).toLocaleDateString('en-GB')}</td>
                                <td className="text-center">
                                    <Link type="button" to={`/chitietphieutra/${dep.Id_PhieuMuon}`} className={`btn btn-link fs-4`}>Xem chi tiết</Link>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        )
    }
}
