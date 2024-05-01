import React, { Component } from "react";
import classNames from 'classnames/bind';
import styles from './QuanLyPhieuTra.module.scss';
import { Link } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';

const cx = classNames.bind(styles);

export class QuanLyPhieuTra extends Component {
    constructor(props) {
        super(props);

        this.state = {
            chitietpms: [],
            tenSachFilter: '',
            tensachWithoutFilter: [] // Khởi tạo mảng chitietpmsWithoutFilter
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

        this.setState({ chitietpms: sortedData });
    }

    refreshList() {
        // Lấy token từ sessionStorage
        const token = sessionStorage.getItem('jwttoken');

        // Kiểm tra nếu token tồn tại
        if (token) {
            // Giải mã token để lấy nd_id
            const decodedToken = jwtDecode(token);
            const nd_id = decodedToken.nameid;

            // Gọi API để lấy danh sách phiếu mượn của người dùng với nd_id này
            fetch(`https://localhost:44315/api/QuanLyPhieuMuon/${nd_id}`)
                .then(response => response.json())
                .then(data => {
                    const filteredData = data.filter(pm => pm.TrangThai === "Đã trả");
                    this.setState({
                        chitietpms: filteredData,
                        tensachWithoutFilter: filteredData // Cập nhật chitietpmsWithoutFilter với dữ liệu mới
                    });
                })
                .catch(error => {
                    console.error('Error fetching data: ', error);
                });
        } else {
            // Xử lý khi không có token
            console.error('Access token not found');
        }
    }


    componentDidMount() {
        this.refreshList();
    }

    render() {

        const { chitietpms, tenSachFilter } = this.state;

        const filteredChitietpms = chitietpms.filter(pm =>
            pm.TenSach.toLowerCase().includes(tenSachFilter.toLowerCase())
        );
        return (
            <div className={cx('wrapper')}>
                <div class="row justify-content-around">
                    <Link type="button" to={`/quanlyphieumuon`} className={"col-4 h4 pb-2 mb-4 text-danger border-bottom border-danger"}>Đang mượn</Link>
                    <Link type="button" to={`/quanlyphieutra`} className={"col-4 h4 pb-2 mb-4 text-success border-bottom border-success"}>Đã trả</Link>
                </div>

                <table className="table table-hover">
                    <thead className="table-danger">

                        <tr>

                            <th className="text-start">ID Phiếu</th>
                            <th className="text-start w-25">
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
                                Tên Sách
                            </th>
                            <th className="text-center">Số lượng</th>
                            <th className="text-center ">Ngày Mượn</th>
                            <th className="text-center ">Hạn Trả</th>
                            <th className="text-center">Trạng Thái</th>
                            <th className="text-center">Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredChitietpms.map(dep =>
                            <tr key={dep.Id_PhieuMuon}>
                                <td className="text-start">{dep.Id_PhieuMuon}</td>
                                <td className="text-start">{dep.TenSach}</td>
                                <td className="text-center">{dep.SoLuongSach}</td>
                                <td className="text-center">{new Date(dep.NgayMuon).toLocaleDateString('en-GB')}</td>
                                <td className="text-center">{new Date(dep.HanTra).toLocaleDateString('en-GB')}</td>
                                <td className="text-center">
                                    {dep.TrangThai === "Đã trả" ?
                                        ((new Date(dep.HanTra) - new Date()) / (1000 * 60 * 60 * 24)) < 0 ?
                                            ` Đã trả - Trễ hạn ${Math.abs(Math.floor((new Date(dep.HanTra) - new Date()) / (1000 * 60 * 60 * 24)))} ngày `
                                            : "Đã trả - Đúng hạn"
                                        : dep.TrangThai === "Đang mượn" ?
                                            ((new Date(dep.HanTra) - new Date()) / (1000 * 60 * 60 * 24)) < 0 ?
                                                `${Math.floor((new Date() - new Date(dep.HanTra)) / (1000 * 60 * 60 * 24))} ngày (Quá hạn)`
                                                : ((new Date(dep.HanTra) - new Date()) / (1000 * 60 * 60 * 24)) >= 0 ?
                                                    `Đang mượn - Còn ${Math.floor((new Date(dep.HanTra) - new Date()) / (1000 * 60 * 60 * 24))} ngày đến hạn`
                                                    : "Đang mượn - Còn hạn trong hạn trả"
                                            : null // handle other cases or provide a default value
                                    }
                                </td>

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
