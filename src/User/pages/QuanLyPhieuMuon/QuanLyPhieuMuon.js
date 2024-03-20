import React, { Component } from "react";
import classNames from 'classnames/bind';
import styles from './QuanLyPhieuMuon.module.scss';
import { Link } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';

const cx = classNames.bind(styles);

export class QuanLyPhieuMuon extends Component {
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
                    this.setState({
                        chitietpms: data,
                        tensachWithoutFilter: data // Cập nhật chitietpmsWithoutFilter với dữ liệu mới
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
                            <th className="text-start ">Ngày Mượn</th>
                            <th className="text-start ">Hạn Trả</th>
                            <th className="text-start">Trạng Thái</th>
                            <th className="text-start">Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredChitietpms.map(dep =>
                            <tr key={dep.Id}>
                                <td className="text-start">{dep.Id}</td>
                                <td className="text-start">{dep.TenSach}</td>
                                <td className="text-center">{dep.SoLuongSach}</td>
                                <td className="text-start">{new Date(dep.NgayMuon).toLocaleDateString('en-GB')}</td>
                                <td className="text-start">{new Date(dep.HanTra).toLocaleDateString('en-GB')}</td>
                                <td className="text-start">{dep.TrangThai}</td>
                                <td className="text-start">
                                    <Link>Xem chi tiết</Link>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        )
    }
}
