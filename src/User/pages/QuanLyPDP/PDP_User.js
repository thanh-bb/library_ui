import React, { Component } from "react";
import classNames from 'classnames/bind';
import styles from './PDP_User.module.scss';
import { jwtDecode } from 'jwt-decode';

const cx = classNames.bind(styles);

export class PDP_User extends Component {
    constructor(props) {
        super(props);

        this.state = {
            phieudongphats: [],
            pm_IdFilter: "",
            phieudongphatsWithoutFilter: []
        }
    }

    FilterFn = () => {
        const { pm_IdFilter, phieudongphatsWithoutFilter } = this.state;

        const filteredData = phieudongphatsWithoutFilter.filter(el =>
            el.pm_Id?.toString().toLowerCase().includes(pm_IdFilter.toString().trim().toLowerCase())
        );
        this.setState({ phieudongphats: filteredData });
    }

    changepm_IdFilter = (e) => {
        this.setState({ pm_IdFilter: e.target.value }, () => {
            this.FilterFn();
        });
    }

    sortResult(prop, asc) {
        var sortedData = this.state.phieudongphatsWithoutFilter.sort(function (a, b) {
            if (asc) {
                return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
            }
            else {
                return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
            }
        });

        this.setState({ phieudongphats: sortedData });
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
            fetch(`https://localhost:44315/api/PhieuDongPhat/FindByNdId/${nd_id}`)
                .then(response => response.json())
                .then(data => {
                    this.setState({
                        phieudongphats: data,
                        phieudongphatsWithoutFilter: data // Cập nhật chitietpmsWithoutFilter với dữ liệu mới
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
        const { phieudongphats } = this.state;

        return (
            <div className={cx('wrapper')}>
                <div className="row mb-4 shadow-sm p-3 mb-5 bg-body-tertiary rounded">
                    <div className="d-flex justify-content-center align-items-center">

                        <div className="col-8">
                            <input
                                className="form-control m-2 fs-4"
                                onChange={this.changepm_IdFilter}
                                placeholder="Tìm theo ID phiếu mượn"
                            />
                        </div>
                        <div className="col-4">
                            Sắp xếp theo ngày đóng:
                            <button type="button" className="btn btn-light"
                                onClick={() => this.sortResult('pdp_NgayDong', true)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-down-square-fill" viewBox="0 0 16 16">
                                    <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5a.5.5 0 0 1 1 0z" />
                                </svg>
                            </button>

                            <button type="button" className="btn btn-light"
                                onClick={() => this.sortResult('pdp_NgayDong', false)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-up-square-fill" viewBox="0 0 16 16">
                                    <path d="M2 16a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2zm6.5-4.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 1 0z" />
                                </svg>
                            </button>
                        </div>


                    </div >
                </div>
                <table className="table table-hover shadow p-3 mb-5 bg-body-tertiary rounded w-5">
                    <thead >
                        <tr>
                            <th className="text-start ">ID Phiếu Phạt</th>
                            <th className="text-center " style={{ width: "18%" }}>

                                Số phiếu mượn
                            </th>
                            <th className="text-center" style={{ paddingLeft: '60px' }}>Tổng Tiền Phạt</th>
                            <th className="text-center w-25">

                                Ngày đóng
                            </th>
                            <th className="text-start w-25">Trạng Thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {phieudongphats.map(dep =>
                            <tr key={dep.pdp_Id}>
                                <td className="text-start">{dep.pdp_Id}</td>
                                <td className="text-center">{dep.pm_Id}</td>
                                <td className="text-start " style={{ paddingLeft: '100px' }}>{dep.pdp_TongTienPhat} VND</td>
                                <td className="text-center">{new Date(dep.pdp_NgayDong).toLocaleDateString('en-GB')}</td>
                                <td className="text-start">{dep.pdp_TrangThaiDong ? 'Đã thanh toán' : 'Chưa thanh toán'}</td>

                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        )
    }
}
